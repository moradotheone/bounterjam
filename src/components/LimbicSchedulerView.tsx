import React, { useState, useEffect } from 'react';
import { ChronotypeProfile, EnergyLevel, LimbicBlock } from '../types';
import { soundEngine } from '../utils/audio';

interface LimbicSchedulerViewProps {
  onBackToBoard: () => void;
  onSnagSprint?: () => void;
}

export const LimbicSchedulerView: React.FC<LimbicSchedulerViewProps> = ({
  onBackToBoard,
  onSnagSprint,
}) => {
  // User input states
  const [wakeUpTime, setWakeUpTime] = useState<string>('07:30');
  const [fixedMeetingTime, setFixedMeetingTime] = useState<string>('12:00');
  const [fixedMeetingTitle, setFixedMeetingTitle] = useState<string>('Reunión de Sincronización');
  const [customTasksInput, setCustomTasksInput] = useState<string>(
    'Programar auth con Supabase (Creación)\nResponder emails y revisar PRs de Bounter (Mantenimiento)\nEstiramientos y lectura de arquitectura (Descompresión)'
  );

  // Active 45/45 Timer state
  const [timerPhase, setTimerPhase] = useState<'focus' | 'transition'>('focus');
  const [secondsLeft, setSecondsLeft] = useState<number>(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Determine Chronotype based on wake-up time
  const getChronotype = (timeStr: string): { profile: ChronotypeProfile; description: string; emoji: string } => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const decimalHour = hours + minutes / 60;

    if (decimalHour >= 5 && decimalHour < 7) {
      return {
        profile: 'Alba',
        emoji: '🌅',
        description:
          'Perfil Alba (Madrugador): Tu despertar natural es temprano. Tu pico de cortisol y dopamina ocurre a primera hora. Tus bloques de Creación (Alta energía) se sitúan por la mañana temprano, y la Descompresión arranca sobre las 19:00.',
      };
    } else if (decimalHour >= 7 && decimalHour <= 9) {
      return {
        profile: 'Cenit',
        emoji: '☀️',
        description:
          'Perfil Cenit (Diurno): Tu despertar natural es entre 7:00 y 9:00. Tu primer bloque debe ser de Mantenimiento para disipar la inercia del sueño. Tus bloques de Creación ocurren a media mañana/mediodía, y la Descompresión empieza sobre las 21:00.',
      };
    } else {
      return {
        profile: 'Ocaso',
        emoji: '🦉',
        description:
          'Perfil Ocaso (Búho): Tu despertar natural es tardío. Tus mañanas son biológicamente lentas (Mantenimiento). Tu pico creativo y de enfoque ocurre al caer la tarde y durante la noche.',
      };
    }
  };

  const chronotype = getChronotype(wakeUpTime);

  // Generate 90-minute blocks according to rules
  const generateSchedule = (): LimbicBlock[] => {
    const [wakeH, wakeM] = wakeUpTime.split(':').map(Number);
    let startMinutes = wakeH * 60 + wakeM;

    const blocks: LimbicBlock[] = [];
    const blockEnergyPattern: Record<ChronotypeProfile, EnergyLevel[]> = {
      Alba: ['creacion', 'creacion', 'mantenimiento', 'creacion', 'mantenimiento', 'descompresion', 'descompresion'],
      Cenit: ['mantenimiento', 'creacion', 'creacion', 'mantenimiento', 'creacion', 'descompresion', 'descompresion'],
      Ocaso: ['mantenimiento', 'mantenimiento', 'creacion', 'creacion', 'creacion', 'descompresion', 'descompresion'],
    };

    const energySeq = blockEnergyPattern[chronotype.profile];

    const formatHour = (mins: number) => {
      const h = Math.floor((mins % 1440) / 60);
      const m = mins % 60;
      return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
    };

    for (let i = 0; i < energySeq.length; i++) {
      const bStart = startMinutes;
      const bEnd = bStart + 90;
      const energy = energySeq[i];

      // Check if fixed meeting lands in this block
      let hasFixedMeeting = false;
      if (fixedMeetingTime) {
        const [mH, mM] = fixedMeetingTime.split(':').map(Number);
        const meetingMins = mH * 60 + mM;
        if (meetingMins >= bStart && meetingMins < bEnd) {
          hasFixedMeeting = true;
        }
      }

      // Default focus and transition descriptions based on energy level
      let focusTitle = '';
      let focusDesc = '';
      let transTitle = '';
      let transDesc = '';

      if (hasFixedMeeting) {
        focusTitle = `Reunión Fija: ${fixedMeetingTitle}`;
        focusDesc = `Atención enfocada y presencia activa en reunión a las ${fixedMeetingTime}.`;
        transTitle = 'Desconexión Cognitiva Post-Reunión';
        transDesc = 'Caminar al aire libre, respiración consciente o hidratación biológica.';
      } else if (energy === 'creacion') {
        focusTitle = i === 1 || i === 0 ? 'Sprint de Creación: Programación Profunda & Arquitectura' : 'Sprint de Creación: Resolución de Problemas Complejos';
        focusDesc = '45 min de máxima atención ejecutiva: escribir código sin notificaciones, deep coding, diseño de modelos.';
        transTitle = 'Fascinación Suave & Descanso Biológico';
        transDesc = '45 min de paseo sin pantalla, café consciente, mirar al horizonte para relajar la convergencia ocular.';
      } else if (energy === 'mantenimiento') {
        focusTitle = 'Mantenimiento: Gestión Algorítmica & Tareas Triviales';
        focusDesc = '45 min para responder pull requests, emails, sincronizar dependencias de repo y ordenar backlog.';
        transTitle = 'Transición Motriz Activa';
        transDesc = '45 min de estiramientos corporales, movimiento suave y reabastecimiento biológico.';
      } else {
        focusTitle = 'Descompresión: Desaceleración Cognitiva';
        focusDesc = '45 min de lectura recreativa en papel, conversación relajada, bajar luces de pantalla.';
        transTitle = 'Preparación Circadiana para el Sueño';
        transDesc = '45 min sin luz azul, regulación de temperatura y sincronización con el reloj biológico.';
      }

      blocks.push({
        id: `limbic-${i + 1}`,
        blockNumber: i + 1,
        startTime: formatHour(bStart),
        endTime: formatHour(bEnd),
        energyLevel: energy,
        focusPhase: {
          minutes: 45,
          title: focusTitle,
          taskDescription: focusDesc,
        },
        transitionPhase: {
          minutes: 45,
          activityTitle: transTitle,
          activityDescription: transDesc,
        },
        isFixedMeeting: hasFixedMeeting,
      });

      startMinutes = bEnd;
    }

    return blocks;
  };

  const schedule = generateSchedule();

  // 45/45 Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      soundEngine.playChime('transition');
      if (timerPhase === 'focus') {
        setTimerPhase('transition');
        setSecondsLeft(45 * 60);
      } else {
        setTimerPhase('focus');
        setSecondsLeft(45 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft, timerPhase]);

  const toggleTimer = () => {
    soundEngine.playChime('click');
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsLeft(45 * 60);
    setTimerPhase('focus');
    soundEngine.playChime('click');
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const timerProgress = Math.round(((45 * 60 - secondsLeft) / (45 * 60)) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Banner / Hero */}
      <section className="bg-white border-b-2 border-[#1E1B4B] py-6 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-yellow-300 border-2 border-[#1E1B4B] shadow-pop flex items-center justify-center text-3xl">
              🧠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1E1B4B] text-yellow-300 text-xs font-bold uppercase tracking-wider">
                  limbicOS Core Engine
                </span>
                <span className="text-xs font-bold text-[#4F46E5] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Regla 45/45 Ultradiana
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#1E1B4B] mt-1">
                Sistema Operativo Biológico de Energía Vital
              </h1>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                Tu energía no se gestiona con horas de reloj industrial. Se sincroniza con la neurociencia: bloques innegociables de 90 minutos y cronotipos naturales.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToBoard}
              className="px-4 py-2 rounded-xl bg-white hover:bg-yellow-100 border-2 border-[#1E1B4B] shadow-badge text-xs font-bold text-[#1E1B4B] cursor-pointer"
            >
              ← Volver al Jam Board
            </button>
          </div>
        </div>
      </section>

      {/* Main Limbic Workspace */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full flex-1 space-y-8">
        {/* Step 1 & Diagnostics: Chronotype Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Natural Wake-up Time & Meeting input (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-[#1E1B4B] p-5 md:p-6 shadow-pop space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-dashed border-[#1E1B4B]/20">
              <span className="text-xl">☀️</span>
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#1E1B4B]">
                  Configuración Biológica Circadiana
                </h3>
                <p className="text-xs text-[#4B5563]">
                  Indica tu hora de despertar natural para detectar tu Perfil:
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                  Hora de Despertar Natural:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={wakeUpTime}
                    onChange={(e) => setWakeUpTime(e.target.value)}
                    className="px-3.5 py-2.5 bg-[#FAF8F5] border-2 border-[#1E1B4B] rounded-xl text-base font-bold text-[#1E1B4B] shadow-badge focus:outline-none"
                  />
                  <div className="text-xs text-[#4B5563]">
                    {chronotype.emoji} Perfil detectado: <strong>{chronotype.profile}</strong>
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons for Chronotypes */}
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setWakeUpTime('06:00')}
                  className={`p-2 rounded-xl border-2 border-[#1E1B4B] text-center transition-all cursor-pointer ${
                    chronotype.profile === 'Alba' ? 'bg-yellow-300 shadow-badge' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div>🌅 Alba</div>
                  <div className="text-[10px] text-gray-600 font-normal">5:00 - 7:00 AM</div>
                </button>
                <button
                  type="button"
                  onClick={() => setWakeUpTime('08:00')}
                  className={`p-2 rounded-xl border-2 border-[#1E1B4B] text-center transition-all cursor-pointer ${
                    chronotype.profile === 'Cenit' ? 'bg-yellow-300 shadow-badge' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div>☀️ Cenit</div>
                  <div className="text-[10px] text-gray-600 font-normal">7:00 - 9:00 AM</div>
                </button>
                <button
                  type="button"
                  onClick={() => setWakeUpTime('10:00')}
                  className={`p-2 rounded-xl border-2 border-[#1E1B4B] text-center transition-all cursor-pointer ${
                    chronotype.profile === 'Ocaso' ? 'bg-yellow-300 shadow-badge' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div>🦉 Ocaso</div>
                  <div className="text-[10px] text-gray-600 font-normal">&gt; 9:00 AM</div>
                </button>
              </div>

              {/* Fixed Meeting Input */}
              <div className="p-3.5 rounded-2xl bg-[#F4EFEA] border-2 border-[#1E1B4B] space-y-2">
                <label className="block text-xs font-bold text-[#1E1B4B]">
                  Reunión Fija Ineludible (Opcional):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={fixedMeetingTime}
                    onChange={(e) => setFixedMeetingTime(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-[#1E1B4B] rounded-lg text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={fixedMeetingTitle}
                    onChange={(e) => setFixedMeetingTitle(e.target.value)}
                    placeholder="Título de reunión"
                    className="px-2.5 py-1.5 bg-white border border-[#1E1B4B] rounded-lg text-xs"
                  />
                </div>
                <p className="text-[10px] text-[#4B5563]">
                  Se respeta estrictamente y se integra en el bloque más cercano sin romper el ciclo ultradiano.
                </p>
              </div>

              {/* Tasks mapping area */}
              <div>
                <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                  Tus Tareas / Bounties a sincronizar:
                </label>
                <textarea
                  rows={3}
                  value={customTasksInput}
                  onChange={(e) => setCustomTasksInput(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border-2 border-[#1E1B4B] rounded-xl text-xs text-[#1E1B4B] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right: Active Profile Diagnostic & Live 45/45 Timer Widget (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Profile Diagnostic Banner */}
            <div className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-5 shadow-pop">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{chronotype.emoji}</span>
                <div>
                  <span className="text-xs uppercase font-extrabold text-[#4F46E5] tracking-wider">
                    Diagnóstico Neurobiológico:
                  </span>
                  <h2 className="text-xl font-display font-extrabold text-[#1E1B4B]">
                    Has sido clasificado como: Perfil {chronotype.profile}
                  </h2>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium bg-[#FAF8F5] p-3 rounded-2xl border border-gray-200">
                {chronotype.description}
              </p>
            </div>

            {/* LIVE 45/45 ULTRADIAN TIMER */}
            <div className="bg-[#1E1B4B] text-white rounded-3xl border-2 border-[#1E1B4B] p-6 shadow-pop-lg relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <h3 className="font-display font-bold text-base text-yellow-300">
                      Temporizador Ultradiano 45/45 en Vivo
                    </h3>
                    <p className="text-xs text-gray-300">
                      Entrenamiento biológico de foco: 45 min de Enfoque + 45 min de Transición
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    timerPhase === 'focus' ? 'bg-yellow-300 text-[#1E1B4B]' : 'bg-emerald-400 text-[#1E1B4B]'
                  }`}
                >
                  {timerPhase === 'focus' ? '🎯 Fase Enfoque' : '🌿 Fase Transición'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                {/* Timer Clock */}
                <div className="flex items-center gap-4">
                  <div className="text-4xl sm:text-6xl font-mono font-extrabold tracking-tight text-white">
                    {formatTimer(secondsLeft)}
                  </div>
                  <div className="text-xs text-gray-300">
                    <div>Fase: <strong>{timerPhase === 'focus' ? '45m Enfoque Absoluto' : '45m Transición Activa'}</strong></div>
                    <div className="text-gray-400 mt-1">Progreso: {timerProgress}%</div>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={toggleTimer}
                    className={`px-6 py-3 rounded-2xl font-display font-bold text-sm shadow-pop transition-all cursor-pointer ${
                      isTimerRunning
                        ? 'bg-red-400 text-[#1E1B4B] hover:bg-red-300'
                        : 'bg-yellow-300 text-[#1E1B4B] hover:bg-yellow-400'
                    }`}
                  >
                    {isTimerRunning ? 'Pausar' : 'Iniciar 45m'}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs font-bold cursor-pointer"
                  >
                    Reiniciar
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 h-3 rounded-full mt-4 overflow-hidden border border-white/20">
                <div
                  className={`h-full transition-all duration-300 ${
                    timerPhase === 'focus' ? 'bg-yellow-300' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: The Structured 90-Minute Limbic Blocks (Full Day Roadmap) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                Regla Inquebrantable #1 & #3
              </span>
              <h2 className="text-2xl font-display font-extrabold text-[#1E1B4B]">
                Tu Día en Bloques Límbicos de 90 Minutos
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                Cada bloque respeta la Regla 45/45. Asigna automáticamente tus tareas a los estados de Creación, Mantenimiento y Descompresión según tu Cronotipo {chronotype.profile}:
              </p>
            </div>

            {onSnagSprint && (
              <button
                onClick={onSnagSprint}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#4F46E5] text-white text-xs font-bold rounded-xl border-2 border-[#1E1B4B] shadow-badge hover:bg-indigo-700 cursor-pointer"
              >
                <span>🚀 Asignar Bounties del Tablero</span>
              </button>
            )}
          </div>

          {/* Grid of 90-minute blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedule.map((block) => {
              const isCreacion = block.energyLevel === 'creacion';
              const isMantenimiento = block.energyLevel === 'mantenimiento';

              return (
                <div
                  key={block.id}
                  className={`rounded-3xl border-2 border-[#1E1B4B] p-5 shadow-sticky flex flex-col justify-between transition-all ${
                    block.isFixedMeeting
                      ? 'bg-[#FEF3C7] ring-2 ring-amber-500'
                      : isCreacion
                      ? 'bg-[#EEF2FF]'
                      : isMantenimiento
                      ? 'bg-[#FFEDD5]'
                      : 'bg-[#ECFDF5]'
                  }`}
                >
                  <div>
                    {/* Block Header */}
                    <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#1E1B4B]/20 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-white border border-[#1E1B4B] text-xs font-extrabold flex items-center justify-center shadow-badge">
                          #{block.blockNumber}
                        </span>
                        <span className="font-display font-bold text-sm text-[#1E1B4B]">
                          {block.startTime} — {block.endTime}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-[#1E1B4B] shadow-badge ${
                          block.isFixedMeeting
                            ? 'bg-amber-300 text-amber-900'
                            : isCreacion
                            ? 'bg-[#4F46E5] text-white'
                            : isMantenimiento
                            ? 'bg-[#F97316] text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {block.isFixedMeeting ? '🔔 Reunión Fija' : `⚡ ${block.energyLevel}`}
                      </span>
                    </div>

                    {/* Phase 1: 45 min Focus */}
                    <div className="bg-white/90 rounded-2xl p-3 border border-[#1E1B4B] shadow-badge mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-[#4F46E5] flex items-center gap-1">
                          <span>🎯 45 min de Enfoque:</span>
                        </span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.2 rounded border border-indigo-200">
                          Minuto 0 a 45
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1E1B4B]">{block.focusPhase.title}</h4>
                      <p className="text-[11px] text-[#4B5563] mt-0.5 leading-relaxed">
                        {block.focusPhase.taskDescription}
                      </p>
                    </div>

                    {/* Phase 2: 45 min Transition */}
                    <div className="bg-white/70 rounded-2xl p-3 border border-[#1E1B4B] shadow-badge">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <span>🌿 45 min de Transición Biológica:</span>
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                          Minuto 45 a 90
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1E1B4B]">{block.transitionPhase.activityTitle}</h4>
                      <p className="text-[11px] text-[#4B5563] mt-0.5 leading-relaxed">
                        {block.transitionPhase.activityDescription}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-4 pt-3 border-t-2 border-dashed border-[#1E1B4B]/20 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#4B5563] font-medium">90 min Innegociable</span>
                    <button
                      onClick={() => {
                        setTimerPhase('focus');
                        setSecondsLeft(45 * 60);
                        setIsTimerRunning(true);
                        soundEngine.playChime('click');
                      }}
                      className="px-3 py-1 bg-yellow-300 hover:bg-yellow-400 border border-[#1E1B4B] rounded-xl font-bold shadow-badge cursor-pointer"
                    >
                      Cargar en Timer ⏱️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

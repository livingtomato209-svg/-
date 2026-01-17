import { useState } from 'react';
import { LogEntry, GameState, HardwareState, Language } from '../types';
import { MR_ROBOT_ASCII, WIRES_COLORS, GAME_CONTENT } from '../constants';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGameEngine = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: generateId(), text: MR_ROBOT_ASCII, type: 'info' },
    { id: generateId(), text: "Select Language / Выберите язык:", type: 'info' },
    { id: generateId(), text: "Type 'lang en' for English", type: 'success' },
    { id: generateId(), text: "Type 'lang ru' for Russian", type: 'success' }
  ]);
  
  const [inputLocked, setInputLocked] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    language: 'EN',
    mode: 'RPG',
    rpg: {
      currentLocation: 'street',
      inventory: ['Raspberry Pi', 'Lockpicks'],
      suspicion: 0,
      doorUnlocked: false,
      guardBypassed: false,
      dialogActive: false,
      codeFound: false,
    },
    hardware: null,
    terminal: {
      targetIp: null,
      exploited: false,
      logsCleared: false
    }
  });

  // Helper to get text based on current language
  const T = () => GAME_CONTENT[gameState.language];

  const addLog = (text: string, type: LogEntry['type'] = 'output') => {
    setLogs(prev => [...prev, { id: generateId(), text, type }]);
  };

  const clearScreen = () => {
    setLogs([]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // --- RPG ENGINE ---
  const processRPG = async (cmd: string, args: string[]) => {
    const texts = T();
    const loc = texts.LOCATIONS[gameState.rpg.currentLocation];

    // Handle Guard Dialog
    if (gameState.rpg.dialogActive) {
      if (cmd === '1' || cmd === '3') {
        addLog(`GUARD: "Nice try. Get out!"`, 'error');
        addLog(texts.MESSAGES.GAME_OVER, 'error');
        setGameState(prev => ({ ...prev, mode: 'GAMEOVER' }));
      } else if (cmd === '2') {
        addLog(`GUARD: "Ugh, finally. Go ahead."`, 'success');
        setGameState(prev => ({
          ...prev,
          rpg: { ...prev.rpg, dialogActive: false, guardBypassed: true }
        }));
      } else {
        addLog("[1], [2], [3] ?", 'warning');
      }
      return;
    }

    switch (cmd) {
      case 'look':
      case 'l':
        addLog(`LOCATION: ${loc.name}`, 'info');
        addLog(loc.description);
        break;

      case 'hint':
        let hintKey = gameState.rpg.currentLocation;
        // Dynamic hints based on state
        if (gameState.rpg.codeFound) {
            if (hintKey === 'office') hintKey = 'office_code_found';
            if (hintKey === 'hallway' && !gameState.rpg.doorUnlocked) hintKey = 'hallway_code_found';
        }
        
        const hint = texts.HINTS[hintKey];
        if (hint) {
            addLog(`HINT: ${hint}`, 'info');
        } else {
            addLog("...", 'info');
        }
        break;

      case 'go':
      case 'move':
      case 'walk':
        const direction = args[0];
        if (!direction) {
          addLog("?", 'warning');
          return;
        }

        const nextLocId = loc.exits[direction];
        
        // Locked door check
        if (loc.id === 'lobby' && direction === 'hallway' && !gameState.rpg.guardBypassed) {
           addLog(texts.GUARD_DIALOG, 'warning');
           setGameState(prev => ({ ...prev, rpg: { ...prev.rpg, dialogActive: true } }));
           return;
        }

        if (loc.id === 'hallway' && direction === 'server_room' && !gameState.rpg.doorUnlocked) {
            addLog(texts.MESSAGES.LOCKED_DOOR, 'error');
            addLog(texts.MESSAGES.ENTER_CODE_INFO, 'info');
            return;
        }

        if (nextLocId) {
            // Stealth check entering hallway
            if (nextLocId === 'hallway' && gameState.rpg.currentLocation === 'lobby') {
                addLog(texts.MESSAGES.CAMERA_AVOID, 'info');
                await delay(1000);
                if (Math.random() > 0.8) { // 20% chance of failure
                    addLog(texts.MESSAGES.CAMERA_CAUGHT, 'error');
                    setGameState(prev => ({ ...prev, mode: 'GAMEOVER' }));
                    return;
                }
                addLog(texts.MESSAGES.CAMERA_SAFE, 'success');
            }

            setGameState(prev => ({ ...prev, rpg: { ...prev.rpg, currentLocation: nextLocId } }));
            // Get new location definition based on language
            const newLoc = texts.LOCATIONS[nextLocId];
            addLog(`Moved to: ${newLoc.name}`, 'success');
            addLog(newLoc.description);
        } else {
            addLog(texts.MESSAGES.CANT_GO, 'warning');
        }
        break;

      case 'search':
      case 'check':
        if (args[0] === 'desk' && loc.id === 'office') {
            addLog(texts.MESSAGES.DESK_SEARCH, 'success');
            setGameState(prev => ({ ...prev, rpg: { ...prev.rpg, codeFound: true } }));
        } else {
            addLog(texts.MESSAGES.NOTHING_INTERESTING, 'warning');
        }
        break;

      case '1984': // Code for server room
        if (loc.id === 'hallway') {
            addLog(texts.MESSAGES.ACCESS_GRANTED, 'success');
            setGameState(prev => ({ ...prev, rpg: { ...prev.rpg, doorUnlocked: true } }));
        } else {
            addLog("...", 'warning');
        }
        break;

      case 'install':
        if (args[0] === 'chip' && loc.id === 'server_room') {
            startHardwareGame();
        } else {
            addLog(texts.MESSAGES.INSTALL_WHAT, 'warning');
        }
        break;
      
      case 'help':
        addLog(gameState.language === 'EN' 
            ? "RPG COMMANDS: go [dir], look, hint, search [item], install [item]" 
            : "КОМАНДЫ: go [направление], look, hint, search [предмет], install [предмет]", 'info');
        break;

      default:
        addLog(texts.MESSAGES.COMMAND_ERROR, 'warning');
    }
  };

  // --- HARDWARE ENGINE ---
  const startHardwareGame = () => {
    clearScreen();
    const texts = T();
    addLog(texts.MESSAGES.HARDWARE_INTRO, 'info');
    
    // Shuffle colors
    const leftColors = [...WIRES_COLORS].sort(() => Math.random() - 0.5);
    const rightColors = [...WIRES_COLORS].sort(() => Math.random() - 0.5);
    
    const colorMap: Record<string, string> = {};
    const leftPorts = ['A', 'B', 'C', 'D'];
    const rightPorts = ['1', '2', '3', '4'];

    leftPorts.forEach((p, i) => colorMap[p] = leftColors[i]);
    rightPorts.forEach((p, i) => colorMap[p] = rightColors[i]);

    const hwState: HardwareState = {
        leftPorts,
        rightPorts,
        colorMap,
        connections: [],
        strikes: 0
    };

    setGameState(prev => ({
        ...prev,
        mode: 'HARDWARE',
        hardware: hwState
    }));

    setTimeout(() => renderHardwareBoard(hwState), 500);
  };

  const renderHardwareBoard = (hw: HardwareState) => {
    const texts = T();
    addLog(`
--- GPIO INTERFACE ---
${texts.MESSAGES.HARDWARE_GOAL}
STRIKES: ${hw.strikes}/3
`, 'info');

    let board = "   LEFT (Source)        RIGHT (Target)\n";
    for(let i=0; i<4; i++) {
        const l = hw.leftPorts[i];
        const r = hw.rightPorts[i];
        
        const lConnected = hw.connections.some(c => c[0] === l);
        const rConnected = hw.connections.some(c => c[1] === r);

        const lText = lConnected ? "[ OK ]" : `[${hw.colorMap[l]}]`;
        const rText = rConnected ? "[ OK ]" : `[${hw.colorMap[r]}]`;

        board += `   Port ${l} ${lText.padEnd(12)}   Port ${r} ${rText}\n`;
    }
    addLog(board);
    addLog("CMD: connect [Left] [Right] (e.g., 'connect A 1')");
  };

  const processHardware = async (cmd: string, args: string[]) => {
    if (!gameState.hardware) return;

    if (cmd === 'hint') {
        addLog(`HINT: ${T().HINTS['hardware']}`, 'info');
        return;
    }
    
    if (cmd === 'connect') {
        const p1 = args[0]?.toUpperCase();
        const p2 = args[1]?.toUpperCase();

        if (!gameState.hardware.leftPorts.includes(p1) || !gameState.hardware.rightPorts.includes(p2)) {
            addLog("Invalid ports.", 'error');
            return;
        }

        // Logic
        const c1 = gameState.hardware.colorMap[p1];
        const c2 = gameState.hardware.colorMap[p2];

        if (c1 === c2) {
            addLog(`Connection Verified: ${c1} Wire.`, 'success');
            const newHw = {
                ...gameState.hardware,
                connections: [...gameState.hardware.connections, [p1, p2]] as [string, string][]
            };
            
            if (newHw.connections.length === 4) {
                setGameState(prev => ({ ...prev, hardware: newHw }));
                addLog("ALL SYSTEMS GO. BOOTING TERMINAL...", 'success');
                await delay(2000);
                clearScreen();
                setGameState(prev => ({ ...prev, mode: 'TERMINAL' }));
                addLog(T().MESSAGES.TERMINAL_INTRO, 'info');
            } else {
                setGameState(prev => ({ ...prev, hardware: newHw }));
                renderHardwareBoard(newHw);
            }
        } else {
            addLog(`SHORT CIRCUIT! ${p1} is ${c1}, ${p2} is ${c2}`, 'error');
            const newStrikes = gameState.hardware.strikes + 1;
            if (newStrikes >= 3) {
                addLog("SYSTEM FRIED. ALARM TRIGGERED.", 'error');
                setGameState(prev => ({ ...prev, mode: 'GAMEOVER' }));
            } else {
                const newHw = { ...gameState.hardware, strikes: newStrikes };

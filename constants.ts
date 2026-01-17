import { GameContent } from './types';

export const MR_ROBOT_ASCII = `
  __  __      _   ____       _           _   
 |  \\/  |    | | |  _ \\     | |         | |  
 | \\  / |_ __| | | |_) | ___| | _____  _| |_ 
 | |\\/| | '__| | |  _ < / _ \\ |/ _ \\ \\/ / __|
 | |  | | |  |_| | |_) |  __/ | (_) >  <| |_ 
 |_|  |_|_|  (_) |____/ \\___|_|\\___/_/\\_\\\\__|
             PHYSICAL ACCESS
`;

export const WIRES_COLORS = ['Red', 'Blue', 'Green', 'Yellow'];

const CONTENT_EN: GameContent = {
  MESSAGES: {
    MISSION: "MISSION: Infiltrate Evil Corp, plant the Pi, hack the network.",
    SURVEY: "Type 'look' to survey your surroundings. Type 'hint' for a clue.",
    LANG_INFO: "Language set to English.",
    COMMAND_ERROR: "Unknown command.",
    CANT_GO: "You can't go that way.",
    LOCKED_DOOR: "The door is locked with a keypad. You need a code.",
    ENTER_CODE_INFO: "Try: type [code] (e.g., 1234)",
    ACCESS_GRANTED: "KEYPAD: *BEEP* ACCESS GRANTED.",
    GUARD_STOP: "The guard blocks your path.",
    CAMERA_AVOID: "Entering Hallway... Avoiding cameras...",
    CAMERA_CAUGHT: "CAMERA SPOTTED YOU! ALARM TRIGGERED!",
    CAMERA_SAFE: "You slipped past the cameras.",
    NOTHING_INTERESTING: "Nothing interesting here.",
    DESK_SEARCH: "You rummage through the papers. You find a sticky note: 'Server Room: 1984'.",
    INSTALL_WHAT: "Install what?",
    WRONG_CODE: "ACCESS DENIED.",
    GAME_OVER: "GAME OVER: You were caught.",
    WIN: "MISSION ACCOMPLISHED. Logs cleared. Exfiltrating...",
    HARDWARE_INTRO: "Initializing Hardware Interface...",
    HARDWARE_GOAL: "GOAL: Connect matching wire colors.",
    TERMINAL_INTRO: "Connected to local network. Type 'help' for tools."
  },
  HINTS: {
    street: "You need to get inside. The alley is a dead end. Try moving NORTH to the lobby.",
    alley: "There is nothing here but trash. Go back to the street.",
    lobby: "The guard won't let you pass to the hallway. Try to 'go hallway' to trigger a conversation, then lie to him.",
    hallway: "The Server Room (North) is locked. The Office (West) is open. Maybe you can find the code in the office?",
    hallway_code_found: "You have the code. The Server Room is North. Try typing the code '1984' to unlock the door.",
    office: "Check the environment. Managers often leave passwords on their desks. Try 'search desk'.",
    office_code_found: "You found the code (1984). Go back to the [hallway] and use it on the locked door.",
    server_room: "You are at the target. You need to plant the device. Use 'install chip'.",
    hardware: "Match the colors! If Left Port A is Red, find the Right Port (1-4) that is also Red. Command: 'connect A [number]'.",
    terminal: "Phase 1: 'scan_network' to find the IP. Phase 2: 'exploit [IP]' to gain access. Phase 3: 'shred' to cleanup."
  },
  GUARD_DIALOG: `
GUARD: "Halt! I don't recognize you. Who are you with?"
[1] "Pizza Delivery! Double pepperoni for the night shift."
[2] "IT Support. Ticket #404, urgent server maintenance."
[3] "I'm just looking for the bathroom."
`,
  LOCATIONS: {
    street: {
      id: 'street',
      name: 'Evil Corp Plaza',
      description: `You are standing on the rainy sidewalk outside Evil Corp's headquarters.
To the NORTH is the main [entrance] with revolving doors.
To the EAST is a dark, trash-filled [alley].`,
      exits: {
        north: 'lobby',
        east: 'alley',
        entrance: 'lobby',
        alley: 'alley'
      }
    },
    alley: {
      id: 'alley',
      name: 'Back Alley',
      description: `Smells like ozone and garbage. You see a maintenance [door] here. 
It looks tightly locked.`,
      exits: {
        west: 'street',
        street: 'street'
      }
    },
    lobby: {
      id: 'lobby',
      name: 'Main Lobby',
      description: `Marble floors and high ceilings. A Security [Guard] stands by the elevators, blocking the way.
He looks bored but alert. You need to get past him to reach the [hallway].`,
      exits: {
        south: 'street',
        hallway: 'hallway', 
        street: 'street'
      }
    },
    hallway: {
      id: 'hallway',
      name: 'Service Hallway',
      description: `Long fluorescent-lit corridor. Security CAMERAS are rotating on the ceiling. 
To the WEST is an unlocked [office] door.
At the end (NORTH) is the [server_room].`,
      exits: {
        lobby: 'lobby',
        server_room: 'server_room',
        office: 'office',
        west: 'office',
        north: 'server_room'
      }
    },
    office: {
      id: 'office',
      name: 'Manager Office',
      description: `A messy office. There is a mahogany [desk] covered in papers and a computer terminal.
The screen is locked.`,
      exits: {
        east: 'hallway',
        hallway: 'hallway'
      }
    },
    server_room: {
      id: 'server_room',
      name: 'Server Room',
      description: `Humming racks of servers surround you. It's freezing.
The main rack has an exposed panel.
ACTION: You can [install chip] here to begin the hack.`,
      exits: {
        hallway: 'hallway'
      }
    }
  }
};

const CONTENT_RU: GameContent = {
  MESSAGES: {
    MISSION: "МИССИЯ: Проникнуть в Evil Corp, установить Pi, взломать сеть.",
    SURVEY: "Введите 'look', чтобы осмотреться. Введите 'hint' для подсказки.",
    LANG_INFO: "Язык переключен на Русский.",
    COMMAND_ERROR: "Неизвестная команда.",
    CANT_GO: "Вы не можете туда пойти.",
    LOCKED_DOOR: "Дверь заперта. Нужен код.",
    ENTER_CODE_INFO: "Попробуйте ввести код (например, 1234)",
    ACCESS_GRANTED: "КЛАВИАТУРА: *ПИП* ДОСТУП РАЗРЕШЕН.",
    GUARD_STOP: "Охранник преграждает путь.",
    CAMERA_AVOID: "Входим в коридор... Избегаем камер...",
    CAMERA_CAUGHT: "ВАС ЗАМЕТИЛА КАМЕРА! ТРЕВОГА!",
    CAMERA_SAFE: "Вы проскользнули мимо камер.",
    NOTHING_INTERESTING: "Здесь нет ничего интересного.",
    DESK_SEARCH: "Вы роетесь в бумагах. Находите стикер: 'Серверная: 1984'.",
    INSTALL_WHAT: "Что установить?",
    WRONG_CODE: "ДОСТУП ЗАПРЕЩЕН.",
    GAME_OVER: "ИГРА ОКОНЧЕНА: Вас поймали.",
    WIN: "МИССИЯ ВЫПОЛНЕНА. Логи очищены. Уходим...",
    HARDWARE_INTRO: "Инициализация оборудования...",
    HARDWARE_GOAL: "ЦЕЛЬ: Соедините провода по цветам.",
    TERMINAL_INTRO: "Подключено к локальной сети. Введите 'help'."
  },
  HINTS: {
    street: "Вам нужно попасть внутрь. Переулок (EAST) тупиковый. Идите на СЕВЕР (North) в вестибюль.",
    alley: "Здесь только мусор. Возвращайтесь на улицу.",
    lobby: "Охранник не пропустит вас в коридор. Попробуйте пойти в коридор ('go hallway'), чтобы начать разговор. Придумайте легенду.",
    hallway: "Серверная (North) заперта. Офис (West) открыт. Возможно, код от двери внутри офиса?",
    hallway_code_found: "У вас есть код. Серверная на севере. Попробуйте ввести код '1984', чтобы открыть дверь.",
    office: "Осмотрите стол. Менеджеры часто записывают пароли на бумажках. Введите 'search desk'.",
    office_code_found: "У вас есть код (1984). Вернитесь в коридор ('go hallway') и попробуйте открыть Серверную.",
    server_room: "Вы у цели. Стойка открыта. Используйте 'install chip', чтобы установить оборудование.",
    hardware: "Соединяйте цвета! Если левый порт A - Красный (Red), найдите правый порт (1-4), который тоже Красный. Команда: 'connect A [номер]'.",
    terminal: "Фаза 1: 'scan_network', чтобы найти IP. Фаза 2: 'exploit [IP]', чтобы получить доступ. Фаза 3: 'shred', чтобы удалить логи."
  },
  GUARD_DIALOG: `
ОХРАННИК: "Стоять! Я вас не знаю. Вы к кому?"
[1] "Доставка пиццы! Двойная пепперони для ночной смены."
[2] "Техподдержка. Тикет #404, срочное обслуживание серверов."
[3] "Я просто ищу туалет."
`,
  LOCATIONS: {
    street: {
      id: 'street',
      name: 'Плаза Evil Corp',
      description: `Вы стоите под дождем у штаб-квартиры Evil Corp.
На СЕВЕРЕ (NORTH) - главный [entrance] с вращающимися дверьми.
На ВОСТОКЕ (EAST) - темный [alley] с мусором.`,
      exits: {
        north: 'lobby',
        east: 'alley',
        entrance: 'lobby',
        alley: 'alley'
      }
    },
    alley: {
      id: 'alley',
      name: 'Задний переулок',
      description: `Пахнет озоном и мусором. Вы видите служебную [door]. 
Она наглухо закрыта.`,
      exits: {
        west: 'street',
        street: 'street'
      }
    },
    lobby: {
      id: 'lobby',
      name: 'Главный вестибюль',
      description: `Мраморные полы. Охранник ([Guard]) стоит у лифтов, преграждая путь.
Он выглядит скучающим, но бдительным. Вам нужно пройти мимо него в коридор ([hallway]).`,
      exits: {
        south: 'street',
        hallway: 'hallway', 
        street: 'street'
      }
    },
    hallway: {
      id: 'hallway',
      name: 'Служебный коридор',
      description: `Длинный коридор с лампами дневного света. На потолке вращаются КАМЕРЫ. 
На ЗАПАДЕ (WEST) - открытая дверь офиса ([office]).
В конце (NORTH) находится серверная ([server_room]).`,
      exits: {
        lobby: 'lobby',
        server_room: 'server_room',
        office: 'office',
        west: 'office',
        north: 'server_room'
      }
    },
    office: {
      id: 'office',
      name: 'Офис менеджера',
      description: `Беспорядок. Стол ([desk]) из красного дерева завален бумагами.
Экран терминала заблокирован.`,
      exits: {
        east: 'hallway',
        hallway: 'hallway'
      }
    },
    server_room: {
      id: 'server_room',
      name: 'Серверная',
      description: `Гудение серверных стоек. Здесь холодно.
У главной стойки открыта панель.
ДЕЙСТВИЕ: Вы можете установить чип ([install chip]), чтобы начать взлом.`,
      exits: {
        hallway: 'hallway'
      }
    }
  }
};

export const GAME_CONTENT = {
  EN: CONTENT_EN,
  RU: CONTENT_RU
};
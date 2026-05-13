// Shared palette primitives: command aliases, navigation modes, and labels.
// Kept as plain globals because Manifest V3 content scripts are loaded in order
// rather than through an ES module bundler.

var SFNAV_MODE_ROOT = 'root';
var SFNAV_MODE_OBJECT_PICKER = 'object-picker';
var SFNAV_MODE_OBJECT_SCOPED = 'object-scoped';
var SFNAV_MODE_FLOW_PICKER = 'flow-picker';
var SFNAV_MODE_APP_PICKER = 'app-picker';
var SFNAV_MODE_SOQL = 'soql';
var SFNAV_MODE_FLOW_DEBUG = 'flow-debug';
var SFNAV_MODE_CMD_PICKER = 'cmd-picker';
var SFNAV_MODE_CMD_SCOPED = 'cmd-scoped';
var SFNAV_MODE_LABEL_PICKER = 'label-picker';
var SFNAV_MODE_SETUP_PICKER = 'setup-picker';

var SFNAV_SHORTCUTS = [
  {
    id: 'object',
    aliases: ['object', 'objects'],
    label: '@object',
    sublabel: 'All standard & custom objects',
    group: 'browse',
    mode: SFNAV_MODE_OBJECT_PICKER,
    hint: 'Press Enter to browse all objects',
  },
  {
    id: 'flow',
    aliases: ['flow', 'flows'],
    label: '@flow',
    sublabel: 'All org flows',
    group: 'browse',
    mode: SFNAV_MODE_FLOW_PICKER,
    hint: 'Press Enter to browse all flows',
  },
  {
    id: 'app',
    aliases: ['app', 'apps'],
    label: '@app',
    sublabel: 'All installed Lightning apps',
    group: 'browse',
    mode: SFNAV_MODE_APP_PICKER,
    hint: 'Press Enter to browse Lightning apps',
  },
  {
    id: 'cmd',
    aliases: ['cmd', 'cmdt', 'mdt'],
    label: '@cmd',
    sublabel: 'Custom metadata types',
    group: 'browse',
    mode: SFNAV_MODE_CMD_PICKER,
    hint: 'Press Enter to browse custom metadata types',
  },
  {
    id: 'label',
    aliases: ['label', 'labels'],
    label: '@label',
    sublabel: 'Custom labels',
    group: 'browse',
    mode: SFNAV_MODE_LABEL_PICKER,
    hint: 'Press Enter to browse custom labels',
  },
  {
    id: 'setup',
    aliases: ['setup'],
    label: '@setup',
    sublabel: 'All setup quick links',
    group: 'browse',
    mode: SFNAV_MODE_SETUP_PICKER,
    hint: 'Press Enter to browse all setup pages',
  },
  {
    id: 'soql',
    aliases: ['soql'],
    label: '@soql',
    sublabel: 'Ask a data question',
    group: 'ai',
    mode: SFNAV_MODE_SOQL,
    action: 'soql-generator',
    hint: 'Press Enter to open the SOQL generator',
  },
  {
    id: 'flow-debug',
    aliases: ['debug', 'flow-debug'],
    label: '@debug',
    sublabel: 'Analyze a flow with Claude',
    group: 'ai',
    mode: SFNAV_MODE_FLOW_DEBUG,
    action: 'flow-debug',
    hint: 'Press Enter to debug this flow',
    disabledHint: 'Open a flow first — then press Enter to debug it',
  },
  {
    id: 'refresh',
    aliases: ['refresh', 'reload'],
    label: '@refresh',
    sublabel: 'Reload cached metadata',
    group: 'maintenance',
    action: 'refresh',
    hint: 'Press Enter to refresh the flow + object caches',
  },
];

function sfnavNormalizeShortcut(value) {
  return (value || '').trim().replace(/^@/, '').toLowerCase();
}

function sfnavGetShortcutsByGroup(group) {
  return SFNAV_SHORTCUTS.filter(function (shortcut) { return shortcut.group === group; });
}

function sfnavFindShortcut(value) {
  var normalized = sfnavNormalizeShortcut(value);
  if (!normalized) return null;
  return SFNAV_SHORTCUTS.find(function (shortcut) {
    return shortcut.aliases.indexOf(normalized) !== -1;
  }) || null;
}

function sfnavParseShortcutInvocation(value) {
  var trimmed = (value || '').trim().replace(/^@/, '');
  var match = trimmed.match(/^(\S+)\s+(.*)$/);
  if (!match) return null;
  var shortcut = sfnavFindShortcut(match[1]);
  if (!shortcut) return null;
  return { shortcut: shortcut, filter: match[2] };
}

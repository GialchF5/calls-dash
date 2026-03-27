(function (global) {
  'use strict';

  const MONTHS = ['дек.25', 'янв.26', 'февр.26', 'мар.26'];
  const MONTH_KEY_MAP = {
    'дек.25': 'dec',
    'янв.26': 'jan',
    'февр.26': 'feb',
    'мар.26': 'mar'
  };

  function parseCsvLine(line) {
    const out = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        out.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map((v) => v.trim());
  }

  function toNumber(val) {
    if (val === null || val === undefined || val === '') return 0;
    const normalized = String(val).replace('%', '').replace(',', '.').trim();
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  function mapRow(header, values) {
    const obj = {};
    header.forEach(function (key, i) {
      obj[key] = values[i] || '';
    });
    return obj;
  }

  function rowToRecords(row) {
    return MONTHS.map(function (monthLabel) {
      const m = MONTH_KEY_MAP[monthLabel];
      return {
        project: row.project,
        source: row.source,
        role: row.role,
        month: monthLabel,
        leads: toNumber(row['leads_' + m]),
        qualified: toNumber(row['qualified_' + m]),
        crQualified: toNumber(row['cr_qualified_' + m]),
        presentations: toNumber(row['presentations_' + m]),
        crPresentations: toNumber(row['cr_presentations_' + m]),
        skype: toNumber(row['skype_' + m]),
        crSkype: toNumber(row['cr_skype_' + m]),
        calls: toNumber(row['calls_' + m]),
        crCalls: toNumber(row['cr_calls_' + m])
      };
    });
  }

  async function load() {
    const resp = await fetch('./data/qual-leads-dec25-mar26.csv');
    if (!resp.ok) throw new Error('Не удалось загрузить CSV нового отчета');

    const text = await resp.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) throw new Error('CSV пустой или поврежден');

    const header = parseCsvLine(lines[0]);
    const records = [];

    for (let i = 1; i < lines.length; i += 1) {
      const row = mapRow(header, parseCsvLine(lines[i]));
      if (!row.project || !row.role || !row.source) continue;
      records.push.apply(records, rowToRecords(row));
    }

    return records;
  }

  global.QualDataLoader = { load: load, MONTHS: MONTHS };
})(window);

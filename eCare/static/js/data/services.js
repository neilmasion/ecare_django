let _cache = null;

export async function fetchServicesData() {
  if (_cache) return _cache;

  try {
    const res  = await fetch('/api/services/');
    const data = await res.json();

    _cache = {};
    data.services.forEach(s => {
      _cache[s.title] = {
        description:  s.description,
        features:     s.features,
        requirements: s.requirements,
        stats: {
          value1: s.stat_value1,
          label1: s.stat_label1,
          value2: s.stat_value2,
          label2: s.stat_label2,
          value3: s.stat_value3,
          label3: s.stat_label3,
        },
      };
    });
    return _cache;
  } catch (err) {
    console.error('Could not load services from API:', err);
    return {};
  }
}

export const servicesData = {};
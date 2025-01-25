import { map, includes, flatten, uniq, sum, sort, prop, descend } from 'ramda';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const MIN_TAGS_MATCH = process.env.MIN_TAGS_MATCH;

export const interestTypes = {
  social: {
    title: 'Pessoal',
    active: 'Tenho interesse no assunto ',
    pacive: 'Quero companhia para ',
    neutral: 'Tenho interesse em relacionamento',
  },
  business: {
    title: 'Comercial',
    active: 'Compro ',
    pacive: 'Vendo ',
  },
  philanthrope: {
    title: 'Solidário',
    active: 'Solicito a doação de ',
    pacive: 'Sou doador de ',
  },
  professional: {
    title: 'Profissional',
    active: 'Sou candidato a vaga de ',
    pacive: 'Contrato para a vaga de ',
  },
  rent: {
    title: 'Aluguel',
    active: 'Sou locador ',
    pacive: 'Sou locatario ',
  },
  loan: {
    title: 'Emprestimo',
    active: 'Solicito emprestimo ',
    pacive: 'Ofereço emprestimo ',
  },
};

export const interestTypesNew = [
  {
    type: 'social',
    title: 'Pessoal',
    color: '#dd5d11',
    image:
      'https://firebasestorage.googleapis.com/v0/b/app-xpunto.appspot.com/o/public%2Fdefault%2F2%20PESSOAL.png?alt=media&token=bcc941ce-025f-4a28-8071-82ceaa670113',
    subTypes: [
      {
        name: 'active',
        description: 'Tenho interesse no assunto ',
        color: '#dd5d11',
      },
      {
        name: 'pacive',
        description: 'Quero companhia para ',
        color: '#fca573',
      },
      {
        name: 'center',
        description: 'Tenho interesse em relacionamento ',
        color: '#fdcfb4',
      },
    ],
  },
  {
    type: 'business',
    title: 'Comercial',
    color: '#65a99b',
    image:
      'https://firebasestorage.googleapis.com/v0/b/app-xpunto.appspot.com/o/public%2Fdefault%2F4%20COMERCIAL.png?alt=media&token=9c4a4d49-ce02-4e4f-8fd2-05a32d91136b',
    subTypes: [
      {
        name: 'active',
        description: 'Compro ',
        color: '#65a99b',
      },
      {
        name: 'pacive',
        description: 'Vendo ',
        color: '#90c1b7',
      },
    ],
  },
  {
    type: 'philanthrope',
    title: 'Solidário',
    color: '#981310',
    image:
      'https://firebasestorage.googleapis.com/v0/b/app-xpunto.appspot.com/o/public%2Fdefault%2F1%20SOLIDA%CC%81RIO.png?alt=media&token=0f9c82ea-2b75-4de8-a2e3-b11806b3ef33',
    subTypes: [
      {
        name: 'active',
        description: 'Solicito a doação de ',
        color: '#981310',
      },
      {
        name: 'pacive',
        description: 'Sou doador de ',
        color: '#ef6967',
      },
    ],
  },
  {
    type: 'professional',
    title: 'Profissional',
    color: '#367687',
    image:
      'https://firebasestorage.googleapis.com/v0/b/app-xpunto.appspot.com/o/public%2Fdefault%2F3%20PROFISSIONAL.png?alt=media&token=466ee266-b235-4b94-abaa-d28e38a5bb55',
    subTypes: [
      {
        name: 'active',
        description: 'Sou candidato a vaga de ',
        color: '#367687',
      },
      {
        name: 'pacive',
        description: 'Contrato para a vaga de ',
        color: '#95c7d5',
      },
    ],
  },
  {
    type: 'loan',
    title: 'Permuta',
    color: '#95e720',
    image:
      'https://firebasestorage.googleapis.com/v0/b/app-xpunto.appspot.com/o/public%2Fdefault%2F6%20PERMUTA.png?alt=media&token=026cbcf1-3973-4d30-ac98-424aca8146bb',
    subTypes: [
      {
        name: 'active',
        description: 'Troco ',
        color: '#95e720',
      },
    ],
  },
  {
    type: 'rent',
    title: 'Aluguel',
    color: '#e7be20',
    image:
      'https://firebasestorage.googleapis.com/v0/b/app-xpunto.appspot.com/o/public%2Fdefault%2F5%20LOCAC%CC%A7A%CC%83O.png?alt=media&token=e8374146-97c2-491b-897d-b3b977d82da0',
    subTypes: [
      {
        name: 'active',
        description: 'Sou locador ',
        color: '#e7be20',
      },
      {
        name: 'pacive',
        description: 'Sou locatario ',
        color: '#f5e5a3',
      },
    ],
  },
];

export const getSubType = (type) => {
  if (type === 'social') return interestTypes.social;
  if (type === 'business') return interestTypes.business;
  if (type === 'philanthrope') return interestTypes.philanthrope;
  if (type === 'professional') return interestTypes.professional;
  if (type === 'rent') return interestTypes.rent;
  if (type === 'loan') return interestTypes.loan;

  return interestTypes;
};

export const binary = (type, subType) => {
  if (type !== 'social' && subType === 'pacive') return 'active';
  if (type !== 'social' && subType === 'active') return 'pacive';

  return subType;
};

export const getPreTitle = (type, subType) => getSubType(type)[subType];

export const counterTagsMatch = ({ interest, tags }) => {
  let count = 0;
  const tagsMatched = [];
  const matchedWith = [];
  map((tagList) => {
    const t = tagList.tags.split(',');
    map((tag) => {
      if (includes(tag, interest.tags)) {
        count++;
        tagsMatched.push(tag);
        matchedWith.push(tagList.id);
      }
    }, t);
  }, tags);
  return {
    count,
    tagsMatched: flatten(tagsMatched),
    matchedWith: flatten(matchedWith),
  };
};

export const countTagsThatMatch = ({ data, tags }) => {
  const interestsWithMatchedTags = map((interest) => {
    const result = {
      ...interest,
      ...counterTagsMatch({ interest, tags }),
    };
    return result;
  }, data);
  return interestsWithMatchedTags;
};

export const sortByTagsAndDistance = ({ data, tags }) => {
  data = countTagsThatMatch({ data, tags });
  return data.sort((a, b) => {
    if (a.count === b.count) {
      const distA = parseFloat(a.distance);
      const distB = parseFloat(b.distance);
      if (isNaN(distA)) return 1;
      if (isNaN(distB)) return 1;
      return distB < distA ? 1 : -1;
    } else return a.count < b.count ? 1 : -1;
  });
};

export const countCommonElements = (array1, array2) => {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  let commonElements = 0;

  for (const element of set1) {
    if (set2.has(element)) {
      commonElements++;
    }
  }

  return commonElements;
};

export const getCommonElements = (array1, array2) => {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  const commonElements = [];

  for (const element of set1) {
    if (set2.has(element)) {
      commonElements.push(element);
    }
  }

  return commonElements;
};

export const mountLocationResponse = ({ distance, state, city }) => {
  if (!distance) return 'Localizacao indisponivel';
  if (!state || !city) return distance;
  return `${city}, ${state} - ${distance}`;
};

export const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const getDistanceFromLatLngInKm = (lat1, lon1, lat2, lon2, precise) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  const result: any = !precise ? `${Math.round(d) + 3}` : d.toFixed(2);
  if (isNaN(result)) return 'Localizaçāo indisponivel.';

  return result;
};

export const addCounterAndTagsMatched = (interests) =>
  uniq(
    flatten(
      interests.map(({ matchs, my }) =>
        matchs.map((interest) => {
          interest.preTitle = getPreTitle(interest.type, interest.subType);
          interest.tags = interest.tags.split(',');
          interest.createdAt = moment(interest.createdAt, 'YYYY-MM-DD').format(
            'DD/MM/YYYY',
          );
          interest.images
            ? (interest.images = interest.images.toString().split(','))
            : (interest.images = null);
          interest.matchCounter = countCommonElements(interest.tags, my.tags);
          interest.tagsMatched = getCommonElements(interest.tags, my.tags);
          interest.related = my;
          return interest;
        }),
      ),
    ),
  );

export const addMatchInformation = (interests) => {
  const transformedInterests = interests.map(({ matchs, my }) => {
    my.tags = my.tags.split(',');
    matchs = matchs.map((interest) => {
      interest.preTitle = getPreTitle(interest.type, interest.subType);
      interest.tags = interest.tags.split(',');
      interest.createdAt = moment(interest.createdAt, 'YYYY-MM-DD').format(
        'DD/MM/YYYY',
      );
      interest.images
        ? (interest.images = interest.images.toString().split(','))
        : (interest.images = null);
      interest.matchCounter = countCommonElements(interest.tags, my.tags);
      interest.tagsMatched = getCommonElements(interest.tags, my.tags);
      return interest;
    });
    matchs = matchs.filter(
      ({ matchCounter }) => matchCounter >= MIN_TAGS_MATCH,
    );
    matchs = sort(descend(prop('matchCounter')), matchs);
    return { total: matchs.length, my, matchs };
  });
  return transformedInterests;
};
export const getMatchsToNotify = (list) => {
  list = list.map((i) => ({ ...i, nofify: applyRules(i) }));
  return list;
};
export const applyRules = (interest) => {
  const rules = [
    {
      number: 1,
      desc: 'Se nao ha notificacoes sobre o interesse',
      result: interest.notification.notificationCounter === 0,
    },
    // {
    //   number: 2,
    //   desc: "Se match 2 tags em comum e ultima notificacao ha mais de 3 dias",
    //   result: verificaData(interest.notification.data[0]?.updatedAt, 3)
    // },
    // {
    //   number: 3,
    //   desc: "Se match 3 tags em comum e ultima notificacao ha mais de 2 dias",
    //   result: interest.matchCounter >= 3 && verificaData(interest.notification.data[0]?.updatedAt, 2)
    // },
    // {
    //   number: 4,
    //   desc: "Se match 4 tags em comum e ultima notificacao ha mais de 2 dias",
    //   result: interest.matchCounter >= 4
    // },
  ];
  return sum(rules.map((o) => o.result)) > 0;
};

export const transformInterestToNotification = (my, match, from) => {
  from = from ? from : my.user_id;
  const notification = {
    pretitle: getPreTitle(my.type, my.subType),
    title: my.title,
    firebaseToken: match.firebaseToken,
    userId: match.user_id,
    to: match.user_id,
    from,
    relation: my.id,
  };
  return notification;
};
export const transformMatchsToNotifications = (my, interest) => {
  const notification = {
    pretitle: getPreTitle(interest.type, interest.subType),
    title: interest.title,
    firebaseToken: my.firebaseToken,
    userId: my.user_id,
    to: my.user_id,
    from: 'worker',
    relation: interest.id,
  };
  return notification;
};

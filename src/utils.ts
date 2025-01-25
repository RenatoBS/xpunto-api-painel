import { Like } from 'typeorm';

export const transformStringToObject = (inputString) => {
  try {
    const array = JSON.parse(inputString);
    if (
      Array.isArray(array) &&
      array.length === 2 &&
      typeof array[0] === 'string' &&
      typeof array[1] === 'string'
    ) {
      const [key, value] = array;

      const obj = { [key]: value.toLowerCase() };
      return obj;
    } else {
      throw new Error('Input string does not match expected format.');
    }
  } catch (error) {
    console.error('Error transforming string:', error.message);
    return null;
  }
};

export const transformObjectToArray = (inputObj) => {
  try {
    const parsedObj = JSON.parse(`${inputObj}`);

    if (typeof parsedObj !== 'object') {
      throw new Error('Input is not a valid JSON object.');
    }

    const keys = Object.keys(parsedObj);
    if (keys.length !== 1) {
      return JSON.parse(inputObj);
    }

    const key = keys[0];
    let values = parsedObj[key];

    if (!Array.isArray(values)) {
      values = [values];
    }

    const result = values.map((value) => ({ [key]: value }));
    return result;
  } catch (error) {
    console.error('Error transforming object:', error.message);
    return JSON.parse(inputObj);
  }
};
const defaultUserImageUrl =
  'https://firebasestorage.googleapis.com/v0/b/app-xpunto.appspot.com/o/public%2FPerfil.jpeg?alt=media&token=03a05c46-305f-4e92-b271-488d274673bf';
const defaultInterestImageUrl =
  'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

export const parseImageProperty = (data) => {
  return Array.isArray(data)
    ? data?.map((e) => ({
        ...e,
        image:
          e.image && !e.images
            ? e.image.toString().split(',')[0]
            : !e.images
            ? defaultUserImageUrl
            : undefined,
        images:
          e.images && !e.image
            ? e.images.toString().split(',')[0]
            : !e.image
            ? defaultInterestImageUrl
            : undefined,
        evidence: e.evidence
          ? e.evidence.toString().split(',')[0]
          : defaultInterestImageUrl,
        preTitle:
          e?.type && e?.subType
            ? listTypes(e.type)[0].subTypes.find(
                ({ name }) => name === e.subType,
              )?.description
            : undefined,
      }))
    : {
        ...data,
        image:
          data?.image && !data.images
            ? data.image.toString().split(',')[0]
            : !data?.images
            ? defaultUserImageUrl
            : undefined,
        images:
          data?.images && !data.image
            ? data.images.toString().split(',')[0]
            : !data?.image
            ? defaultInterestImageUrl
            : undefined,
        evidence: data?.evidence
          ? data.evidence.toString().split(',')[0]
          : defaultInterestImageUrl,
        preTitle:
          data?.type && data?.subType
            ? listTypes(data.type)[0].subTypes.find(
                ({ name }) => name === data.subType,
              ).description
            : undefined,
      };
};
export const mountFilter = (query) => {
  if (!query) return {};
  const { range, filter, sort } = query;
  const where = filter ? transformObjectToArray(filter) : {};
  const order = sort ? transformStringToObject(sort) : undefined;
  const [start, end] = range ? JSON.parse(range) : [null, null];
  const take = range ? end - start : 100;
  const skip = range ? start : 0;

  return { take, skip, order, where };
};

const interestTypesNew = [
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
      },
      {
        name: 'pacive',
        description: 'Quero companhia para ',
      },
      {
        name: 'center',
        description: 'Tenho interesse em relacionamento para ',
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
      },
      {
        name: 'pacive',
        description: 'Vendo ',
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
      },
      {
        name: 'pacive',
        description: 'Sou doador de ',
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
      },
      {
        name: 'pacive',
        description: 'Contrato para a vaga de ',
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
        description: 'Solicito permuta ',
      },
      {
        name: 'pacive',
        description: 'Ofereço permuta ',
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
      },
      {
        name: 'pacive',
        description: 'Ofereço emprestimo ',
      },
    ],
  },
];

export const listTypes = (type) => {
  const result = type
    ? interestTypesNew.filter((t) => t.type === type)
    : interestTypesNew;
  return result;
};

export const mountLikeFilter = (p) => {
  const resp = {};
  for (const [key, value] of Object.entries(p)) {
    Object.assign(resp, {
      [key]: Like(`%${value}%`),
    });
  }
  return resp;
};

export const filterStateAndCity = (obj) => {
  obj =
    Array.isArray(obj) && obj.length >= 1 && obj[0].id
      ? { ['userLocations.userId']: { $in: obj.map((o) => o.id) } }
      : obj;
  obj = Array.isArray(obj) && obj.length == 1 ? obj[0] : obj;
  Object.assign(
    obj,
    obj.state
      ? { ['userLocations.state']: { $regex: new RegExp(obj.state, 'i') } }
      : {},
    obj.city
      ? { ['userLocations.city']: { $regex: new RegExp(obj.city, 'i') } }
      : {},
    obj.name ? { name: { $regex: new RegExp(obj.name, 'i') } } : {},
    obj.mail ? { mail: { $regex: new RegExp(obj.mail, 'i') } } : {},
    obj.zipcode ? { zipcode: { $regex: new RegExp(obj.zipcode, 'i') } } : {},
    obj.phone ? { phone: { $regex: new RegExp(obj.phone, 'i') } } : {},
    obj.birth ? { birth: new Date(obj.birth).toISOString() } : {},
  );
  delete obj.state;
  delete obj.city;
  return obj;
};

export const filterTag = (obj) => {
  obj = Array.isArray(obj) && obj.length == 1 ? obj[0] : obj;
  Object.assign(
    obj,
    obj.value ? { value: { $regex: new RegExp(obj.value, 'i') } } : {},
  );
  return obj;
};

export const transformToLikeQuery = (list) => {
  if (Array.isArray(list)) {
    for (const obj of list) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'string') {
            obj[key] = Like(`%${obj[key]}%`);
          }
        }
      }
    }
  } else {
    const obj = list;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          obj[key] = Like(`%${obj[key]}%`);
        }
      }
    }
  }
  return list;
};

const controllers = [];

export const registerController = (name) => {
  controllers.push(name);
  return (...params) => {
    console.log(`${getTS()} [${name}]\t`, ...params);
  };
};

export const log = (...params) => {
  console.log(`${getTS()}\t\t\t`, ...params);
};

const getTS = () => {
  const ts = Date.now();
  const date_ob = new Date(ts);
  const date = date_ob.getDate();
  const month = date_ob.getMonth() + 1;
  const year = date_ob.getFullYear();
  const hour = date_ob.getHours();
  const minute = date_ob.getMinutes();
  const seconds = date_ob.getSeconds();
  return `${date}/${month}/${year} ${pad(hour, 2)}:${pad(minute, 2)}:${pad(
    seconds,
    2
  )}`;
};

const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};

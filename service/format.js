// function by @vanessaberdibi

function formatDate(date = new Date()) {
  const resultDate = `${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()}`;
  const isPm = date.getHours() >= 12;
  let hours = isPm ? date.getHours() - 12 : date.getHours();
  hours = hours === 0 ? 12 : hours;
  const resultHour = `${hours}:${date.getMinutes()} ${isPm ? 'PM' : 'AM'}`;

  const dataResult = `${resultDate} ${resultHour}`;

  return dataResult;
}

module.exports = {
  formatDate,
};
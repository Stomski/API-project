const dateFormatting = (date) => {
  // console.log(date);
  const newDate = new Date(date);
  // console.log("newdate>>>>>>>>.", newDate);
  // console.log(newDate.getMonth() + 1);
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  const day = newDate.getDate();
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const seconds = newDate.getSeconds();
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/*
when using above,

    ele.createdAt = dateFormatting(ele.createdAt);
    ele.updatedAt = dateFormatting(ele.updatedAt);

*/

module.exports = { dateFormatting };

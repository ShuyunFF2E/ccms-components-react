const monthArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const miniWeek = ['日', '一', '二', '三', '四', '五', '六'];

function current() {
	return new Date();
}

function getMonthSize(year, month) {
	const now = current();
	return new Date((year || now.getFullYear()), (month || now.getMonth() + 1), 0).getDate();
}

function getWeekDisplayRange(year, month) {
	const now = current();
	const mm = month || now.getMonth();
	const yy = year || now.getFullYear();

	return [new Date(yy, mm - 1, 1).getDay(), new Date(yy, mm, 0).getDay()];
}
// 获取当前年月日时分秒对象
function displayNow(date = current()) {
	const now = new Date(date)
	const newHour = `0${now.getHours()}`;
	const newMinute = `0${now.getMinutes()}`;
	const newSecond = `0${now.getSeconds()}`;
	return {
		year: now.getFullYear(),
		month: now.getMonth() + 1,
		day: now.getDate(),
		hour: newHour.substr(newHour.length - 2, 2),
		minute: newMinute.substr(newMinute.length - 2, 2),
		second: newSecond.substr(newSecond.length - 2, 2),
	}
}

function today() {
	const now = current();
	return `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()}`;
}
// 根据年月获取对应面板的日期详情
function getMonthData(year, month) {
	let _year = year;
	const dRange = getWeekDisplayRange(year, month);
	const monthSize = getMonthSize(year, month);
	const startDay = dRange[0];
	const endDay = dRange[1];
	const dayBefore = startDay;
	const dayAfter = 6 - endDay;
	const prevMonthDays = [];
	const nextMonthDays = [];
	const curMonthDays = [];
	let prevMonth = null;

	if (month - 1 === 0) {
		prevMonth = 12;
		_year -= 1;
	} else {
		prevMonth = month - 1;
	}

	const prevRange = getMonthSize(_year, prevMonth);

	for (let i = 0; i < dayBefore;) {
		prevMonthDays.push(prevRange - i);
		i += 1;
	}
	for (let j = 1; j <= dayAfter;) {
		nextMonthDays.push(j);
		j += 1;
	}
	for (let k = 0; k < monthSize;) {
		curMonthDays.push(k + 1);
		k += 1;
	}

	return {
		prev: prevMonthDays.reverse(),
		current: curMonthDays,
		next: nextMonthDays
	}
}

function refreshDays(year, month) {
	// eslint-disable-next-line no-shadow
	const { prev, current, next } = getMonthData(year, month);
	return prev.concat(current).concat(next);
}
// 格式转换format
function convert(date, fmt) {
	const { year, month, day, hour, minute, second } = date;
	const currentDate = new Date(`${year}/${month}/${day} ${hour}:${minute}:${second}`);
	const o = {
		'M+': month,
		'd+': day,
		'h+': hour,
		'm+': minute,
		's+': second,
		'q+': Math.floor((currentDate.getMonth() + 3) / 3),
		'S': currentDate.getMilliseconds()
	};
	let _fmt = fmt;
	if (/(y+)/.test(_fmt)) {
		_fmt = _fmt.replace(RegExp.$1, (year.toString()).substr(4 - RegExp.$1.length));
	}
	Object.keys(o).forEach(k => {
		if (new RegExp(`(${k})`).test(_fmt)) {
			_fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((o[k].toString()).length)));
		}
	});
	return _fmt;
}

function range(from, to) {
	let _to = null;
	let _from = null;
	if (to === undefined) {
		_to = from;
		_from = 0;
	}
	const arr = [];
	for (let i = _from; i < _to;) {
		arr[i] = i;
		i += 1;
	}
	return arr;
}

function formatTime(param, d = '') {
	if (param === '') {
		return  d;
	}
	if (param.length === 2) {
		return param;
	}
	return `0${param}`;
}

function transformObj(date) {
	if (date) {
		return displayNow(date);
	}
	return null;
}

const utils = {
	convert,
	formatTime,
	refreshDays,
	displayNow,
	today,
	monthArr,
	miniWeek,
	transformObj,
	range
}

export default utils;

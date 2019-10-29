import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import utils from '../util';
import WeekGrid from './week';
import { selector, formatZero } from '../util/view-common';


const defaultYear = new Date().getFullYear();
const defaultMonth = new Date().getMonth() + 1;
const defaultDay = new Date().getDate();

function Grid(props) {
    const { month, day, checkValue, showToday, onChange } = props;

    const [tempMonth, setTempMonth] = useState(month);
    const [tempDay, setTempDay] = useState(day);
	const [isClickDay, setIsClickDay] = useState(false);

    useEffect(() => {
        setTempMonth(month);
	}, [month]);

	useEffect(() => {
		setTempDay(day);
	}, [day]);

    function onPickDate(value) {
		setIsClickDay(true);
        setTempDay(value);
    }

    function onSave(value, m) {
        if (value) {
            onChange(value, m);
        } else {
            onChange(formatZero(tempDay));
        }
    }

    const days = utils.refreshDays(defaultYear,  tempMonth || defaultMonth );
    const len = Math.ceil(days.length / 7);
	return (
        <div className="grid">
		<table className="grid-table">
            <thead>
                <tr>
                    {utils.miniWeek.map((e, i) => <th key={i.toString()}>{e}</th>)}
                </tr>
            </thead>
            <tbody>
                {utils.range(len).map((e, i) =>
                    <WeekGrid key={i.toString()}
					  	currentDateObj={{
						  month: tempMonth,
						  day: tempDay
					  	}}
                        month={tempMonth}
                        day={tempDay}
						isClickDay={isClickDay}
                        checkValue={checkValue}
                        onPickDate={(value) => onPickDate(value)}
                        days={days.slice(i * 7, (i + 1) * 7)}
                        head={i === 0}
                        tail={i === len - 1} />
                )}
            </tbody>
        </table>
        <div className={`${selector}-popup-btns`} style={{ justifyContent: 'flex-end' }}>
			{
				showToday && <button type="button" onClick={() => onSave(formatZero(defaultDay), defaultMonth)} >今天</button>
			}
            <button type="button" disabled={!tempDay} className={`${selector}-popup-btns-ok`} onClick={() => onSave()} style={{ marginLeft:'10px' }}>确认</button>
        </div>
	</div>);
}

Grid.propTypes = {
    month: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string
	]),
    day: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string
	]),
	showToday: PropTypes.bool,
    checkValue: PropTypes.string,
	onChange: PropTypes.func
}

Grid.defaultProps = {
	showToday: false,
	month: undefined,
	day: undefined,
    checkValue: '',
	onChange: () => { }
}

export default Grid;

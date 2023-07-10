export const timeFormatter = dirtyTime =>
{
    let time = dirtyTime.split(":");

    time = time.slice(0, 2);

    let twelveHourText = '';
    let timeInt = parseInt(time[0])
    switch (timeInt)
    {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
            twelveHourText = "AM";
            break;
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
        case 12:
        case 23:
            time[0] -= 12;
            twelveHourText = "PM";
            break;
    }

    console.log(`${time[0]}:${time[1]} ${twelveHourText}`);
    return `${time[0]}:${time[1]} ${twelveHourText}`;
}

export const dateTransformer = (date) =>
{
    const dateDate = new Date(date);
    const yearUTC = dateDate.getUTCFullYear()
    const dayOfWeekUTC = dateDate.getUTCDay()
    const month = dateDate.getUTCMonth()
    const day = dateDate.getUTCDate()
    const daysOfWeek = {
        1: "MON",
        2: "TUE",
        3: "WED",
        4: "THU",
        5: "FRI",
        6: "SAT",
        0: "SUN"
    }
    const months = {
        0: "JAN",
        1: "FEB",
        2: "MAR",
        3: "APR",
        4: "MAY",
        5: "JUN",
        6: "JUL",
        7: "AUG",
        8: "SEP",
        9: "OCT",
        10: "NOV",
        11: "DEC"
    }

    let hour = dateDate.getUTCHours()
    let minutes = dateDate.getUTCMinutes()
    let amPm = "PM";

    hour > 12 ? hour -= 12 : amPm = 'AM'
    minutes = (minutes < 10 ? '0' : '') + minutes;

    return {
        year: yearUTC,
        month: month + 1,
        monthName: months[month],
        day: day,
        dayName: daysOfWeek[dayOfWeekUTC],
        hour: hour,
        minutes: minutes,
        amPm: amPm
    }
}

export const dateString = (dateStr) =>
{
    const returnDate = `${dateStr.year}-${dateStr.month}-${dateStr.day} • ${dateStr.hour}:${dateStr.minutes} ${dateStr.amPm}`;

    return returnDate;
}

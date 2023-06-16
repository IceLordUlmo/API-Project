export const timeFormatter = dirtyTime =>
{
    let time = dirtyTime.split(":");

    time = time.slice(0, 2);

    let twelveHourText;
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
        case 23:
            time[0] -= 12;
        case 12:
            twelveHourText = "PM";
            break;
    }

    return `${time[0]}:${time[1]} ${twelveHourText}`;
}

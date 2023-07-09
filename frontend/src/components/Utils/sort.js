export const SortEvents = events =>
{
    const dateNow = new Date();
    const past = events.filter(event => new Date(event.startDate) < dateNow);
    const future = events.filter(event => new Date(event.startDate) > dateNow);

    return [...past.sort((a, b) => { return new Date(a.startDate) - new Date(b.startDate) }),
    ...future.sort((a, b) => { return new Date(a.startDate) - new Date(b.startDate) })]
}

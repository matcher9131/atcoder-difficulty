(() => {
    let s = "";
    const table = document.querySelector("table");
    for (const tr of table.querySelectorAll("tr")) {
        const cells = tr.querySelectorAll("td");
        if (cells.length !== 4 || cells[1].querySelector("span[data-original-title='Algorithm']") == null || cells[3].textContent === "-") continue;
        const href = cells[1].querySelector("a")?.getAttribute("href");
        if (href == null) continue;
        const dateString = cells[0].querySelector("time")?.textContent;
        if (dateString == null) continue;
        const date = new Date(Date.parse(dateString));
        const rating = (() => {
            const matchResult = /^\s*(?<min>\d+)?\s*~\s*(?<max>\d+)?\s*$/.exec(cells[3].textContent);
            if (matchResult == null || matchResult.groups == null) return null;
            return { min: parseInt(matchResult.groups["min"]), max: parseInt(matchResult.groups["max"]) };
        })();
        const contestName = href.substring(href.lastIndexOf("/") + 1);
        const obj = { date, rating };
        s += `"${contestName}": ${JSON.stringify(obj, null, 0)}, `;
    }
    return s;
})();
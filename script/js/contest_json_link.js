(() => {
    const table = document.querySelector("table");
    for (const tr of table.querySelectorAll("tr")) {
        tr.appendChild(document.createElement("td"));
        const cells = tr.querySelectorAll("td");
        if (cells.length != 5 || cells[1]?.querySelector("span[data-original-title='Algorithm']") == null || cells[3]?.textContent == "-") continue;
        const href = cells[1]?.querySelector("a")?.getAttribute("href");
        if (href == null) continue;
        const link = document.createElement("a");
        link.href = `${href}/standings/json`;
        link.download = href.substring(href.lastIndexOf("/") + 1);
        link.textContent = "json";
        cells[4].appendChild(link);
    }
})();

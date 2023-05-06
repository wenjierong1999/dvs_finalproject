<script>
    import * as d3 from "d3";
    const [height, width] = [600, 600];
    export let data;
    const range_lat = d3.extent(data.gps, (d) => d.lat);
    const range_lon = d3.extent(data.gps, (d) => d.long);
    const point_class = d3.extent(data.pointsofinterest, (d) => d.type);
    //scaler for longtitude
    const xscale = d3.scaleLinear().domain(range_lon).range([0, width]);
    //scaler for lantitude
    const yscale = d3.scaleLinear().domain(range_lat).range([height, 0]);
    const colorscale = d3
        .scaleOrdinal()
        .domain(point_class)
        .range(d3.schemeSet1);

    let caridlist = [];
    for (const p of data.gps) {
        caridlist.push(p.car_id);
    }
    export const unique_caridlist = [...new Set(caridlist)];

    let selectedcarid = null;

    //Function for updating page when selecting a specific car
    function handleSelect() {
    //let p = document.getElementById("detaillink");
    //p.innerHTML = "Go to <a href='/cars/{selectedcarid}'>details</a> for car" + selectedcarid;

    d3.selectAll("#gpstrack")
    .data(data.gps)
    .style("fill", d=>d.car_id === selectedcarid ? "red" : "black")
    .style("opacity", d=>d.car_id === selectedcarid ? 1 : 0.05)
  }
</script>
<h1>Jierong Wen - KU Leuven - r0912240</h1>
<h2>Overview</h2>
<p>
Select car to hightlight
<select bind:value={selectedcarid} id="carselection" on:change={handleSelect}>
    {#each unique_caridlist as carid}
        <option value={carid}>Car {carid} </option>
    {/each}
</select>
</p>

{#if selectedcarid != null}
    <p>Go to <a href='/cars/{selectedcarid}' data-sveltekit-prefetch>details</a> for car{selectedcarid}</p>
{/if}

<svg viewBox="0 0 {width} {height}" style="max-width: {width}px">
    <g transform="translate(0,0)">
        {#each data.pointsofinterest as point}
            <circle
                id="pointsofinterest"
                cx={xscale(point.long)}
                cy={yscale(point.lat)}
                fill={colorscale(point.type)}
                r="5"
            >
                <title>
                    {point.name}
                </title>
            </circle>
        {/each}
    </g>

    <g transform="translate(0,0)">
        {#each data.gps as point}
            <circle
                id="gpstrack"
                cx={xscale(point.long)}
                cy={yscale(point.lat)}
                r="2.5"
                opacity="0.05"
            />
        {/each}
    </g>
</svg>



<script>
    import * as d3 from "d3";
    export let data;
    const width = 350;
    const height = 350;
    const margin = { top: 10, right: 10, bottom: 10, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const day_list = Array.from({ length: 14 }, (_, i) => i + 6);
    //console.log(arr);
    let slider_value = 0;
    const unique_carid = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 101, 104,
        105, 106, 107,
    ];
    $: currentcarid = Number(data.currentcarid);

    $: previous_carindex = unique_carid.indexOf(currentcarid) - 1;

    $: next_carindex = unique_carid.indexOf(currentcarid) + 1;

    function getcurrentday(m){
        //when slider is at the right end point, slider value 20160 will yield day 20 which is unvalid
        if(m>=20160){
            return 19;
        }
        return Math.floor(m/1440)+6;
    }

    function getcurrentminute(m){
        if(m>=20160){
            return 1440;
        }
        return m-((getcurrentday(m)-6)*1440)
    }

    //$: currentday = () => {6+Math.floor(slider_value/(24*60))}

    const range_lat = d3.extent(data.gps, (d) => d.lat);
    const range_lon = d3.extent(data.gps, (d) => d.long);
    const xscale = d3.scaleLinear().domain(range_lon).range([0, width]);
    const yscale = d3.scaleLinear().domain(range_lat).range([height, 0]);
    // The time in stops data is measured in seconds, hence the maximum should be 86400
    const tb_xscale = d3
        .scaleLinear()
        .domain([0, 86400])
        .range([0, innerWidth]);
    const hour_scale = d3.scaleLinear().domain([0, 24]).range([0, innerWidth]);
    const point_class = d3.extent(data.pointsofinterest, (d) => d.type);
    const colorscale = d3
        .scaleOrdinal()
        .domain(point_class)
        .range(d3.schemeSet1);
    const bar_scale = d3.scaleBand().domain(day_list).range([0, innerHeight]);
    bar_scale.paddingInner(0.05);

    const blackbarxscale = d3.scaleLinear().domain([0,1440]).range([0,innerWidth-5])

    let leftaxis = d3.axisLeft(bar_scale);
    function addleftaxis() {
        d3.select("#leftaxis").call(leftaxis);
    }

    //console.log(unique_carid.indexOf(107))
    //console.log(Array.from({ length: 5 }, (_, i) => i * 6))
</script>

<a href="/">Car overview</a> <br />
{#if previous_carindex >= 0}
    <a href="/cars/{unique_carid[previous_carindex]}">Previous car</a>
{/if}
{#if next_carindex <= unique_carid.length - 1}
    <a href="/cars/{unique_carid[next_carindex]}">Next car</a>
{/if}

<h1>Jierong Wen - KU Leuven - r0912240</h1>
<h2>Details for car {data.currentcarid}</h2>
<div class="col-5">
    <label class="form-label col-sm-10">
        <input
            type="range"
            class="form-range"
            min="0"
            max="20160"
            step="1"
            bind:value={slider_value}
        />
    </label>
</div>
<p>Current day: {getcurrentday(slider_value)} Current Minute: {getcurrentminute(slider_value)}</p>

<div class="plotarrange">
    <svg id="scatterplot2" class="plot">
        {#each data.gps as p}
            {#if p.cumulative_minute_total >= slider_value - 15 && p.cumulative_minute_total <= slider_value + 15}
                <circle
                    id="gps_selected"
                    cx={xscale(p.long)}
                    cy={yscale(p.lat)}
                    fill="red"
                    r="2.5"
                    opacity="1"
                />
            {:else}
                <circle
                    id="gps_selected"
                    cx={xscale(p.long)}
                    cy={yscale(p.lat)}
                    fill="blue"
                    r="2.5"
                    opacity="0.3"
                />
            {/if}
        {/each}
    </svg>

    <svg id="timeblock" class="plot">
        <g id="leftaxis" use:addleftaxis transform="translate(20,0)" />
        <g transform="translate({margin.left},0)">
            {#each data.stops as p}
                {#if p.start.day <= 19 && p.start.day >= 6}
                    <rect
                        x={tb_xscale(p.start.time)}
                        y={bar_scale(p.start.day)}
                        height={bar_scale.bandwidth()}
                        width={tb_xscale(p.end.time - p.start.time)}
                        fill={colorscale(p.location.location_type)}
                    >
                        <title
                            >{p.start.time}-{p.end.time}: {p.location.name} ({p
                                .location.location_type})
                        </title>
                    </rect>
                {/if}
            {/each}
        </g>

        <g transform="translate({margin.left},0)">
            <rect 
                x={blackbarxscale(getcurrentminute(slider_value))}
                y={bar_scale(getcurrentday(slider_value))}
                height={bar_scale.bandwidth()}
                width=3
                fill="black">
        </g>

        <g id="bottomaxisline" transform="translate({margin.left},0)">
            {#each Array.from({ length: 5 }, (_, i) => i * 6) as l}
                <line
                    x1={hour_scale(l)}
                    x2={hour_scale(l)}
                    y1="0"
                    y2={innerHeight + 10}
                    stroke="LightGray"
                    stroke-width="1.5"
                />
            {/each}
        </g>

        <g id="bottomaixstext" transform="translate({margin.left},0)">
            {#each Array.from({ length: 5 }, (_, i) => i * 6) as l}
                <text
                    x={hour_scale(l)}
                    y={innerHeight + 15}
                    text-anchor="middle"
                    style="font-size:0.65em;"
                    >{l}
                </text>
            {/each}
        </g>
    </svg>
</div>

<style>
    input[type="range"] {
        width: 300px;
        color: skyblue;
    }

    .plotarrange {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    .plot {
        margin: 50px;
    }
    #scatterplot2 {
        height: 300px;
        width: 300px;
    }
    #timeblock {
        height: 400px;
        width: 400px;
    }
</style>

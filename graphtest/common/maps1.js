  // Declare the chart dimensions and margins.

  // map ratio is 277.61 x 424.52

import {d3, Grid, data_check, graph_tools, msgBox, colours} from '/bundle.js';

const width = w + marginLeft;
const height = h + 20;

// Tooltip functions
function la_mouseover(event, tooltip) {
    tooltip.style.opacity = 1;
    event.target.style.strokeWidth = linewidth * 3;
}

function la_mousemove(event, tooltip, nameid) {
    let event_value = "-";
    if ('data' in event.target.__data__) {
        event_value = event.target.__data__.data.data;
    }
    tooltip.innerHTML = event.target.__data__.properties[nameid] + ": " + event_value;
    tooltip.style.left = event.pageX + 15 + "px";
    tooltip.style.top = event.pageY +  "px";
}

function la_mouseleave(event, tooltip) {
    tooltip.style.opacity = 0;
    event.target.style.strokeWidth = linewidth;
}


function addInset(features, linearscale, mapcentre, mapscale, padding, svg, nameid, tooltip){
    const path = d3.geoPath(d3.geoMercator()
            .center(mapcentre)
            .scale(mapscale)
            );
   
    // get bounds of inset
    var bounds = [[Infinity,Infinity],[0,0]];
    for (let feature of features) {
        const featurebounds = path.bounds(feature);
        // Surely there's some better way to write this
        if (bounds[0][0] > featurebounds[0][0]) {
            bounds[0][0] = featurebounds[0][0];
        }
        if (bounds[0][1] > featurebounds[0][1]) {
            bounds[0][1] = featurebounds[0][1];
        }
        if (bounds[1][0] < featurebounds[1][0]) {
            bounds[1][0] = featurebounds[1][0];
        }
        if (bounds[1][1] < featurebounds[1][1]) {
            bounds[1][1] = featurebounds[1][1]
        }
    }
    // Add padding
    let center = [(bounds[0][0] + bounds[1][0]) * 0.5,
                   (bounds[0][1] + bounds[1][1]) * 0.5]

    // Again, surely a better way
    bounds[0][0] = bounds[0][0] + (bounds[0][0] - center[0]) * padding;
    bounds[0][1] = bounds[0][1] + (bounds[0][1] - center[1]) * padding;
    bounds[1][0] = bounds[1][0] + (bounds[1][0] - center[0]) * padding;
    bounds[1][1] = bounds[1][1] + (bounds[1][1] - center[1]) * padding;


    drawFeatures(features, path, linearscale, nameid, tooltip)

    // draw a square around inset
    svg.append("rect")
        .attr("x", bounds[0][0])
        .attr("y", bounds[0][1])
        .attr('width', bounds[1][0] - bounds[0][0])
        .attr('height', bounds[1][1] - bounds[0][1])
        .style("stroke", "#000")
        .style("fill", "none")
}



function set_palette(el) {
    var map_colours = colours[el.value]
    // if palette is loaded successfuly, change the header tint to the correct
    // colour
    if (map_colours) {
        if (map_colours) {
            document.querySelector(".graph-header").style.setProperty("border-bottom", 
                "10px solid rgb(" + map_colours.primary + ")" // Javascript is awful
            )
        }
    }
    // Also set palette options when built
    const palette = [...document.querySelectorAll(".palette-cell")];
    let set_selected = true;
    palette.forEach(cell => {
        if (set_selected) {
            cell.classList.add("palette-cell__selected");
            set_selected = false;
        }
        cell.addEventListener("click", (event) => {
            select_palette_colour(event.currentTarget);
            make_map_if_data();
        })
    })

}

function make_map_if_data() {
    const state = get_map_page_state();
    // If user has entered data in the table, draw the map
    if (state[0].length > 0) {
        draw_map(
            document.getElementById('map'), width, height, ...state
        );
    };
}

function select_palette_colour(el) {
    // Remove element from currently selected palettes
    const selected = [...document.querySelectorAll(".palette-cell__selected")];
    selected.forEach(cell => {
        cell.classList.remove("palette-cell__selected");
    });
    el.classList.add("palette-cell__selected");
}


export function initMapPage() {
    add_grid(document.getElementById('grid'));

    const map_settings = document.getElementById("map-settings");
    const org_list = document.getElementById("org_list");

    set_palette(org_list);

    org_list.addEventListener("change", (event) => {
        set_palette(event.target);
        make_map_if_data();
    })

    map_settings.addEventListener("change", (event) => {
        make_map_if_data();
    });

    document.getElementById("map-dl").addEventListener("click", () => {
        graph_tools.download_svg(document.querySelector('#map > svg'))})
};

// Bisection Method
function Bisect() {
	var table = document.getElementById("table");		// The table where values will be inputted.
	deleteAllTableRow(table);
	var _function = $('#function').val();				// The function, ie. f(x).
	var xl = $('#initial_xl').val();					// xl = initial 1st value.
	var xu = $('#initial_xu').val();					// xu = initial 2nd value.		
	var precision = $('#precision').val();				// The desired precision, ie. significant digits.

	// Conditions.
	var max_iterations = $('#max_iterations').val();	
	var tolerance = $('#tolerance').val();				

	// The variables below will be passed through functions.
	var iteration = 0;			// The current iteration.
	var ms = [];				// Stores mid points (m), will be used in calculating relative percent true error.
	var m, m_1; 				// m = mid point, m_1 = mid point m+1 
	var f_xl, f_xu, f_m;		// f_xl = f(xl), f_xu = f(xu), f_m = f(m)	
	var ea, et;					// ea = relative percent approximate error, et = relative percent true error.
	var true_value;				// The true value.

	var orig_xl = xl;
	var orig_xu = xu;

	max_iterations = parseInt(max_iterations);
	precision = parseInt(precision);
	xl = parseFloat(xl);
	xu = parseFloat(xu);
	m = (xl + xu) / 2;			// Midpoint.

	while((xu - xl) > tolerance && iteration <= max_iterations) {
		f_m = parse(_function, m);		// f_m = f(m).
		f_xl = parse(_function, xl);	// f_xl = f(xl).
		f_xu = parse(_function, xu);	// f_xu = f(xu).							

		ms.push(m.toPrecision(precision));		// Stores mid points (m).
		
		newTableRow(table, iteration, xl, f_xl, xu, f_xu, m, f_m, ea, ms, precision);	// Create and insert values in new table row.
		
		true_value = ((xl + xu) / 2).toPrecision(precision);
		
		if(f_xl * f_m < 0) {			
			xu = m;
		} else if(f_xl * f_m > 0) {
			xl = m;
		} else {
			break;	// Stop Computation.
		}

		var new_m = (xl + xu) / 2;	// Temp new midpoint.
		ea = get_ea(new_m, m);		// get relative percent approximate error.
		m = new_m; 					// Store new midpoint.

		iteration++;	// Increment iteration;
	}

	insert_et(table, true_value, ms);	// Insert relative percent true error (et).
	document.getElementById("approx").innerHTML = "XT " + "&#8776; " + true_value;

	// Show outputs.
	$("#output").show();
	draw(orig_xl, parse(_function, orig_xl), orig_xu, parse(_function, orig_xu));	// Draw graph.
	return false;
}

function parse(_function, x) {
	var parser = math.parser();

	parser.eval('f(x) = '.concat(_function));
	parser.set('x', x);
	return parser.eval(_function);
}

// Create and insert values in new table row.
function newTableRow(table, iteration, xl, f_xl, xu, f_xu, m, f_m, ea, ms, precision) {
	var row = table.insertRow(-1);
	var cols = [];

	for(var i = 0; i < 9; i++) {
		cols[i] = row.insertCell(i);
	}

	cols[0].innerHTML = iteration;
	cols[1].innerHTML = xl.toPrecision(precision);		// .toPrecision(n), Formats a number to significant digits length.
	cols[2].innerHTML = f_xl.toPrecision(precision);
	cols[3].innerHTML = xu.toPrecision(precision);
	cols[4].innerHTML = f_xu.toPrecision(precision);
	cols[5].innerHTML = m.toPrecision(precision);
	cols[6].innerHTML = f_m.toPrecision(precision);
	cols[7].innerHTML = (isNaN(ea) || ea == null) ? "-------" : ea.toFixed(2);	// .toFixed, Formats a number to a fixed length of decimals.
}

function deleteAllTableRow(table) {
	while(table.rows.length > 1) {
		table.deleteRow(1);
	}	
}

// Return relative percent approximate error (ea).
function get_ea(new_m, m) {
	return (Math.abs(new_m - m) / Math.abs(new_m)) * 100;
}

// et = relative percent true error (et).
function get_et(true_value, m) {
	return (Math.abs(true_value - m) / Math.abs(true_value)) * 100;
}

// Inserts et into the table.
function insert_et(table, true_value, ms) {
	var cellIndex = 8;	// column of the relative percent true error (et).

	for(var i = 1; i < table.rows.length; i++) {		
		var tableCell = document.getElementById("table").rows[i].cells[cellIndex];
		var et = get_et(true_value, ms[i - 1]);	// Calculate the relative percent true error (et).
		tableCell.innerHTML = et.toFixed(2);	// .toFixed, Formats a number to a fixed length of decimals.
	}
}

// Returns true if number is NaN, else returns false.
function isNaN(x) {
	return x !== x;
}

var width = 800;
var height = 400;
// desired xDomain values
var xScale = [-10, 10]

function draw(xl, f_xl, xu, f_xu) {
	try {
		functionPlot({
			width: width,
			height: height,
			xDomain: xScale,
			yDomain: computeYScale(width, height, xScale),
			target: '#plot',
			data: [{				
				fn: document.getElementById('function').value,
				sampler: 'builtIn',	// this will make function-plot use the evaluator of math.js
				graphType: 'polyline'
			}, {
				points: [
					[xl, f_xl],
					[xu, f_xu]
				],
				fnType: 'points',
    			graphType: 'scatter'
			}]
		});		
	} catch (err) {
		// console.log(err);
		alert(err);
	}
}

function computeYScale (width, height, xScale) {
	var xDiff = xScale[1] - xScale[0]
	var yDiff = height * xDiff / width
	return [-yDiff / 2, yDiff / 2]
}



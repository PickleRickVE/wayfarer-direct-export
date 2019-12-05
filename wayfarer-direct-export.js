// ==UserScript==
// @name         Wayfarer Direct Export
// @version      0.1
// @description  Directly export nomination data from Wayfarer
// @namespace	 https://github.com/PickleRickVE/
// @downloadURL	 https://github.com/PickleRickVE/blob/master/wayfarer-direct-export.js
// @homepageURL	 https://github.com/PickleRickVE/
// @match        https://wayfarer.nianticlabs.com/*
// ==/UserScript==

/* globals unsafeWindow */

function init() {
	const w = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

	let nominationController;
	let candidates = [];
	let nominations;

	initScript();

	function initScript() {
		const el = w.document.querySelector('.nominations-controller');
		if (!el) {
			//console.log('not in nominations');
			return;
		}

		nominationController = w.angular.element(el).scope().nomCtrl;

		if (nominationController !== null) {
			addExportButton();

			analyzeCandidates();
		}
		return;
	}

	function analyzeCandidates() {
		if (!nominationController.loaded) {
			setTimeout(analyzeCandidates, 200);
			return;
		}
		let timestamp = Date.now();
		nominations = nominationController.nomList;
		nominations.forEach(function(item) {
			if (item.status == 'NOMINATED' || item.status == 'VOTING') {
				let candidate = {
					'id': item.id,
					'timestamp': timestamp,
					'status': item.status,
					'nickname': 'player',
					'responsedate': 'null',
					'lat': item.lat,
					'lng': item.lng,
					'title': item.title,
					'description': item.description,
					'submitteddate': item.day,
					'imageurl': item.imageUrl
				};
				candidates.push(candidate);
			}
		});
	}

	function newDialog() {
		let choice = 'csv';
		let textareaContent = generateOutput(choice);
		let newDiaContent = '<div class="modal-dialog" role="document" style="width: 420px;">'
        + '<div class="modal-content">'
        +  '<div class="modal-header">'
        +    '<h3 class="modal-title">Output Candidates</h3>'
        +    '<button id="closeDiaX" type="button" class="close" data-dismiss="modal" aria-label="Close">'
        +      '<span aria-hidden="true">&times;</span>'
        +    '</button>'
        +  '</div>'
        +  '<div class="modal-body">'
        +    '<div class="input-group mb-3">'
        +      '<textarea id="outputCandidates" style="height: 300px; width: 400px;" class="form-control" aria-label="Candidates output">' + textareaContent + '</textarea>'
        +    '</div>'
        +    '<div>'
        +      '<div>'
        +        '<div style="margin-left: 10px; margin-top: 10px;">'
        +          '<label class="nom-arrange-label" style="margin-right: 20px;">'
        +          '<span style="margin-right: 10px; vertical-align: 0.3em;">CSV</span>'
        +          '<input class="radio-btn" type="radio" name="exportType" id="exportTypeCSV" value="csv" checked>'
        +          '</label>'
        +          '<label class="nom-arrange-label">'
        +          '<span style="margin-right: 10px; vertical-align: 0.3em;">SQL</span>'
        +          '<input class="radio-btn" type="radio" name="exportType" id="exportTypeSQL" value="sql">'
        +          '</label>'
        +        '</div>'
        +      '</div>'
        +    '</div>'
        +  '</div>'
        +  '<div class="modal-footer">'
// to do: save as file
        +    '<button id="copyOutput" class="button-secondary" type="button" style="margin-right: 15px;" float-left>Copy output</button>'
        +    '<button id="closeDia" class="button-primary" type="button">Close</button>'
        +  '</div>'
        +'</div>';
		let newDia = document.createElement('dialog');
		newDia.id = 'outputDialog';
  		newDia.innerHTML = newDiaContent;
  		newDia.setAttribute('style', 'border: 0px; background-color: transparent;')
  		let existingDiv = document.querySelector('.container');
  		let create = existingDiv.appendChild(newDia);
  		document.getElementById("outputDialog").showModal();
  		document.getElementById("outputCandidates").focus();
  		document.getElementById("closeDia").addEventListener("click", () => {
          document.getElementById("outputDialog").close();
        });
        document.getElementById("closeDiaX").addEventListener("click", () => {
          document.getElementById("outputDialog").close();
        });
        document.getElementById("copyOutput").addEventListener("click", () => {
          document.getElementById("outputCandidates").select();
          document.execCommand('copy');
        });
        document.getElementById("exportTypeCSV").addEventListener("click", () => {
          choice = 'csv';
          textareaContent = generateOutput(choice);
          document.getElementById("outputCandidates").value = textareaContent;
        });
        document.getElementById("exportTypeSQL").addEventListener("click", () => {
          choice = 'sql';
          textareaContent = generateOutput(choice);
          document.getElementById("outputCandidates").value = textareaContent;
        });
	}

	function generateOutput(choice) {
		let outputCSVItems = '';
		let outputCSVHead = 'id,timestamp,title,description,lat,lng,status,nickname,submitteddate,responsedate,candidateimageurl';
		let outputSQL = '';
		let outputSQLA = 'INSERT INTO nomination (id, timestamp, title, description, lat, lng, status, nickname, submitteddate, responsedate, candidateimageurl) VALUES (';
		let outputSQLB = ') ON DUPLICATE KEY UPDATE ';
		candidates.forEach(function(item) {
			outputCSVItems += '\n' + item.id + ',' + item.timestamp + ',"' + item.title + '","' + item.description + '",' + item.lat + ',' + item.lng + ',' + item.status + ',' + item.nickname + ',' + item.submitteddate + ',' + item.responsedate + ',' + item.imageurl;
		});
		let outputCSV = outputCSVHead + outputCSVItems;

		candidates.forEach(function(item) {
			outputSQL += outputSQLA + '"' + item.id + '",' + item.timestamp + ',"' + item.title + '","' + item.description + '",' + item.lat + ',' + item.lng + ',"' + item.status + '","' + item.nickname + '",' + item.submitteddate + ',' + item.responsedate + ',"' + item.imageurl + '"' + outputSQLB + 'title="' + item.title + '", description="' + item.description + '", lat=' + item.lat + ', lng=' + item.lng + ', status="' + item.status + '", nickname="' + item.nickname + '", submitteddate=' + item.submitteddate + ', responsedate=' + item.responsedate + ', candidateimageurl="' + item.imageurl + '";\n';
		})
		if (choice == 'csv') {
			return outputCSV;
		} else if (choice == 'sql') {
		    return outputSQL;
		}
	}

	function addExportButton() {
		const link = document.createElement('a');
		link.className = 'sidebar-item sidebar-wayfarerexporter';
		link.title = 'Export candidates';
		link.style.paddingLeft = '27px';
		link.innerHTML = '<span class="glyphicon glyphicon-share" style="margin-right: 15px;"></span> Export';
		const ref = document.querySelector('.sidebar-nominations');

		ref.parentNode.appendChild(link);

		link.addEventListener('click', function(e) {
			e.preventDefault();
			newDialog();
		});
	}

}

init();
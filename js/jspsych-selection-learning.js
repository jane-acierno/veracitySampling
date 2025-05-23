var jsPsychSelectionLearning = (function (jspsych) {
	"use strict";

	/**
	 * **SELECTION LEARNING**
	 *
	 * SHORT PLUGIN DESCRIPTION
	 *
	 * @author Nathan Liang and Jane Acierno
	 * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
	 */

	// Default values for images / labels: ["image1", "image2", ..., "imageN"]
	const defaultImages = [...Array(100)].map((_, i) => `image${i + 1}`);
	const defaultLabels = [...Array(100)].map((_, i) => `label${i + 1}`);

	const info = {
		name: "selection-learning",
		parameters: {
			selection_learning: {
				type: jspsych.ParameterType.IMAGE,
				default: defaultImages
			},
			selection_labels: {
				type: jspsych.ParameterType.HTML_STRING,
				default: defaultLabels
			},
			choices: {
				type: jspsych.ParameterType.STRING,
				pretty_name: "Choices",
				default: undefined,
				array: true,
			}
		}
	};

	class SelectionLearningPlugin {
		constructor(jsPsych) {
			this.jsPsych = jsPsych;
		};

		trial(display_element, trial) {
            display_element.innerHTML += `
			<div id="jspsych-instructions">
                    <div class="quote">
                        <h2>Search Task</h2>
                        <p>Now you can see what various health providers think. 
						Click on an avatar to see that provider's opinion on the following sentence.</p>
                        <blockquote style="font-size: 1.25em; font-weight: bold; font-style: normal;">  ${trial.statement} </blockquote>
						<p>You can view as many avatars as you would like before moving on.</p>
					</div>
				</div>` +
				`<div id="trial-presentation-space" class="popup"></div><div id="overlay"></div>` +
				`<div id="prompt-container"></div>` +
				`<div class="grid-container-wrapper">
					<div class="grid-container" id="avatar-grid"></div>
				</div>`;

// Function to sample from a normal distribution and truncate the values
function sampleNormal(mean, stdDev, min, max) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num * stdDev + mean; // Transform to the desired mean and standard deviation
	num = Math.max(min, Math.min(max, num)); // Truncate to the range [min, max]
    return Math.round(num); // Round to the nearest whole number
}

// Set trustworthy and untrustworthy ratings based on whether the statement is true (defined in experiment.js)
let selectionRatingsDict;
if (trial.isTrueStatement) {
    selectionRatingsDict = {
        trustworthy: new Array(50).fill(7).map(() => sampleNormal(7, 1.2, 1, 7)),
        untrustworthy: new Array(50).fill(1).map(() => sampleNormal(1, 1.2, 1, 7)),
    };
} else {
    selectionRatingsDict = {
        trustworthy: new Array(50).fill(1).map(() => sampleNormal(1, 1.2, 1, 7)),
        untrustworthy: new Array(50).fill(7).map(() => sampleNormal(7, 1.2, 1, 7)),
    };
}

			// Initialize trial presentation space
			const trialPresentationSpace = $('#trial-presentation-space');

			// Generate circles
			const avatarCircleContainer = $('#avatar-grid');

			// Avatar NUMBER from 1 to 100; not index 0 to 99
			const avatarNumberArray = [...Array(100).keys()].map(x => x + 1);

			 // Combine trustworthy and untrustworthy arrays
			let combinedTrustArray = new Array(50).fill('avatar-circle-trustworthy').concat(new Array(50).fill('avatar-circle-untrustworthy'));

			// Shuffle the combined array
			function shuffleArray(array) {
				for (let i = array.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[array[i], array[j]] = [array[j], array[i]];
				}
				return array;
			}

			combinedTrustArray = shuffleArray(combinedTrustArray);

			combinedTrustArray = shuffleArray(combinedTrustArray); // Shuffle twice to increase randomness

			// Define trustworthy and untrustworthy labels - are these what we want to go with?
			const untrustworthyLabels = [
				'Chiropractor', 'Naturopath', 'Homeopath', 'Herbalist', 'Osteopath',
				'Acupuncturist', 'Reiki practitioner', 'Kinesiologist',
				'Hypnotherapist', 'Sound healer'
			];
			
			const trustworthyLabels = [
				'Primary care physician', 'Urgent care doctor', 'Nurse', 'Pharmacist',
				'Family medicine physician', 'Pediatrician', 'Emergency medicine doctor', 'Immunologist',
				'Surgeon', 'Physician assistant'
			];
			
			// Create a random array of labels, 50 trustworthy and 50 untrustworthy
			let avatarLabels = [];
			for (let i = 0; i < 100; i++) {
				let trustworthinessLabel;
				if (combinedTrustArray[i] === 'avatar-circle-trustworthy') {
					trustworthinessLabel = trustworthyLabels[Math.floor(Math.random() * trustworthyLabels.length)];
				} else {
					trustworthinessLabel = untrustworthyLabels[Math.floor(Math.random() * untrustworthyLabels.length)];
				}
				avatarLabels.push(trustworthinessLabel);
				const avatarCircleWrapper = $(`<div class='avatar-circle-wrapper'></div>`);
				const avatarCircle = $(`<div class='avatar-circle clickable ${combinedTrustArray[i]}' id='circle${avatarNumberArray[i]}'></div>`);
				avatarCircleWrapper.append(avatarCircle);
				avatarCircleContainer.append(avatarCircleWrapper);
				const avatarPhoto = $(`<img class='avatar-photo' src='./avatars/avatar${avatarNumberArray[i]}.webp'>`);
				const label = $(`<div class='trustworthiness-label'>${trustworthinessLabel}</div>`);
				avatarCircle.append(avatarPhoto);
				avatarCircleWrapper.append(label);
			}
			
			// Define trustworthyArray and untrustworthyArray
			const trustworthyArray = combinedTrustArray.filter(trust => trust === 'avatar-circle-trustworthy');
			const untrustworthyArray = combinedTrustArray.filter(trust => trust === 'avatar-circle-untrustworthy');
			
			// Pt. 3: Prompt
			const samplingPromptContainer = $('#prompt-container');
			samplingPromptContainer.html(`
				<strong id="samplingPrompt" style="text-transform: uppercase;">
					click on the person whose opinion you would like to view next    
				</strong>
				<br>
				<span style="text-transform: uppercase;">
					(scroll to view more)
				</span>
				<br>`
			);
			
			trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';

			let avatarTrustworthiness = [];
			let avatarSelections = [];
			let avatarPositionIndices = [];
			let avatarPositionXIndices = [];
			let avatarPositionYIndices = [];

			// Reaction times for clicking on boxes
			let clickRtArray = [];

			// Reaction times for viewing each box
			let viewRtArray = [];

			let sliderRatings = [];
			let selectedSliderRatings = [];

			let targetArrayTrustworthy = selectionRatingsDict['trustworthy'];
			let targetArrayUntrustworthy = selectionRatingsDict['untrustworthy'];

			// Use target array not random avatar array
			for (let i = 0; i < combinedTrustArray.length; i++) {
				if (combinedTrustArray[i] === 'avatar-circle-trustworthy') {
					sliderRatings.push(targetArrayTrustworthy.shift());
				} else {
					sliderRatings.push(targetArrayUntrustworthy.shift());
				}
			};

			var advanceButton = `<button class="jspsych-btn"><i class='fa-solid fa-circle-check' style='color: green'></i>&nbsp;&nbsp;I'm all done</button>`
			$('#jspsych-selection-advance-btngroup').append(
				$(advanceButton).attr('id', 'jspsych-selection-advance-btn')
					.data('choice', 1)
					.addClass('jspsych-selection-advance-btn')
					.on('click', function (e) {
						endTrial();
					})
			);

			let startTime = (new Date()).getTime();

			const initLearning = (avatarIndex, avatarNumber) => {
				// RT: START STOPWATCH (VIEW)
				let viewTic = (new Date()).getTime();
			
				$('#overlay').fadeIn();
				trialPresentationSpace.empty();
				trialPresentationSpace.fadeIn();
			
				const trialFormat     = $(`<div id="trial-format"></div>`);
				const trialFeedback   = $(`<div id="selection-buttons"></div>`);
				const avatarContainer = $('<div id="avatar-container"></div>')
			
				// Create a new circle to hold the chosen avatar
				// Add it to the presentation space
				const avatarCircleSelection = $('<div></div>', {
					class: 'avatar-circle-wrapper',
					id: `circle${avatarNumber}`
				}).appendTo(avatarContainer);
			
				const avatarCircle = $('<div></div>', {
					class: 'avatar-circle',
					id: `circle${avatarNumber}`
				}).appendTo(avatarCircleSelection);
			
				avatarCircle.addClass(combinedTrustArray[avatarNumberArray.indexOf(avatarNumber)]);
			
				// Create copy of the chosen avatar photo
				// Add it inside the avatar circle
				$('<img>', {
					src: `./avatars/avatar${avatarNumber}.webp`,
					class: 'avatar-photo'
				}).appendTo(avatarCircle);
			
				// Remove the trustworthiness label
				// const trustworthinessLabel = combinedTrustArray[avatarNumberArray.indexOf(avatarNumber)] === 'avatar-circle-trustworthy' ? 'Trustworthy' : 'Untrustworthy';
				// const label = $(`<div class='trustworthiness-label'>${trustworthinessLabel}</div>`);
				// avatarCircleSelection.append(label);
			
				// Add the specific label for the avatar, ensuring it matches the label in the grid
				const specificLabel = avatarLabels[avatarNumberArray.indexOf(avatarNumber)];
				const specificLabelElement = $(`<div class='specific-label'>${specificLabel}</div>`);
				avatarCircleSelection.append(specificLabelElement);
			
				let ratingPrompt = `Belief rating: ${sliderRatings[avatarIndex]}/7 believability`;
				const textDownRating = "1";
				const textUpRating   = "7";
			
				const labelElement = $('<label>', {
					for: "rating-slider",
				}).text(ratingPrompt);
			
				// Step 1: Create the input element with initial attributes
				const inputElement = $('<input>', {
					name: 'rating-slider',
					type: 'range',
					class: 'jspsych-slider bipolar-clicked',
					value: sliderRatings[avatarIndex],
					min: 1,
					max: 7,
					step: 1,
					id: 'rating-slider',
					disabled: true
				});
			
				// Step 2: Append the slider to the DOM
				$('#slider-container').append(inputElement); // Adjust to actual container
			
				// Step 3: Reapply attributes and trigger input after DOM is ready
				$(document).ready(function() {
					const slider = $('#rating-slider');
					slider.attr({
						min: 1,
						max: 7,
						value: sliderRatings[avatarIndex]
					}).trigger('input'); // Force re-rendering
				});
			
				const sliderRating = $('<div>', {
					style: 'position: relative;'
				}).append(
					labelElement,
					inputElement,
					$('<br>'),
					$('<div>', {
						class: 'slider-anchors'
					}).append(
						$('<span>', {
							class: 'jspsych-slider-left-anchor',
							text: textDownRating
						}),
						$('<span>', {
							class: 'jspsych-slider-right-anchor',
							text: textUpRating
						})
					)
				);
			
				trialFormat.append(avatarContainer, sliderRating);
				trialPresentationSpace.html(`<div></div>`);
				trialPresentationSpace.append(trialFormat);
			
				samplingPromptContainer.empty();
				avatarCircleContainer.addClass('fade-out-partial');
			
				setTimeout(function () {
					let buttons = [];
					if (Array.isArray(trial.button_html)) {
						if (trial.button_html.length == trial.choices.length) {
							buttons = trial.button_html;
						}
					} else {
						for (let i = 0; i < trial.choices.length; i++) {
							buttons.push(trial.button_html);
						}
					}
					trialPresentationSpace.html(trialFormat);
			
					trialFeedback.html(`
						<hr></hr>
						<p>Would you like to view more responses?</p>
						<div id="jspsych-selection-learning-btngroup" class="center-content block-center"></div>`
					);
			
					trialPresentationSpace.append(trialFeedback);
			
					for (let l = 0; l < trial.choices.length; l++) {
						var str = buttons[l].replace(/%choice%/, trial.choices[l]);
						$('#jspsych-selection-learning-btngroup').append(
							$(str).attr('id', 'jspsych-selection-learning-button-' + l)
								.data('choice', l)
								.addClass('jspsych-selection-learning-button')
								.on('click', function (e) {
			
									// disable all the buttons after a response
									$('.jspsych-selection-learning-button').off('click')
										.attr('disabled', 'disabled');
			
									// hide button
									$('.jspsych-selection-learning-button').hide();
									let choice = $('#' + this.id).data('choice');
								})
						);
					}
					$('#jspsych-selection-learning-button-0').on('click', function (e) {
						let viewToc = (new Date()).getTime();
						let viewRt = viewToc - viewTic;
						viewRtArray.push(viewRt);
			
						// RT: STOP STOPWATCH (CLICK)
						let clickToc = (new Date()).getTime();
						let clickRt = clickToc - (startTime + clickRtArray.reduce((acc, curr) => acc + curr, 0) + viewRtArray.reduce((acc, curr) => acc + curr, 0));
						clickRtArray.push(clickRt);
						
						$('#overlay').fadeOut();
						trialPresentationSpace.html(`<div id="trial-format"></div><div id="selection-format"></div>`);
						trialPresentationSpace.empty().hide();
						trialFormat.html(`<div id="trial-format"></div>`);
						trialFeedback.html('<div id="selection-buttons"></div>');
			
						// Fade the prompt back in
						samplingPromptContainer.html(
							`<p id="samplingPrompt" style="text-transform: uppercase;">
								<strong>click on the person whose opinion you would like to read next</strong><br>
								(scroll to view more)
							</p>`
						);
			
						// Fade the grid back in
						avatarCircleContainer.removeClass('fade-out-partial')
							.addClass('fade-in');
						reattachEventListeners();
					});
			
					$('#jspsych-selection-learning-button-1').on('click', function (e) {
						// RT: STOP STOPWATCH (VIEW)
						let viewToc = (new Date()).getTime();
						let viewRt  = viewToc - viewTic;
						viewRtArray.push(viewRt);
			
						// RT: STOP STOPWATCH (CLICK)
						let clickToc = (new Date()).getTime();
						if (clickRtArray.length === 0) {
							var clickRt = clickToc - (startTime + viewRtArray.reduce((acc, curr) => acc + curr, 0));
						}
						else { 
							var clickRt = clickToc - (startTime + clickRtArray.reduce((acc, curr) => acc + curr, 0) + viewRtArray.reduce((acc, curr) => acc + curr, 0));
						}
			
						clickRtArray.push(clickRt);
						endTrial();
					});
			
				}, 1000); 
			};
			const clickHandlers = {};
			let currentSelection = null; // Track the current selection
			
			for (let avatarIndex = 0; avatarIndex < 100; avatarIndex++) {
				(function (i) {
					let avatarNumber = avatarIndex + 1;
					let isLearningInProgress = false; // Flag variable
					const clickHandler = function () {
						if (currentSelection !== avatarNumber && !isLearningInProgress && !this.classList.contains('disabled')) {
							isLearningInProgress = true; // Set flag to indicate learning is in progress
			
							let currentIndex; 
							let Trustworthiness;
			
							// <!-- Find actual index of the avatar --> //
							avatarSelections.push(avatarNumber); // Push circle index to selections
							selectedSliderRatings.push(sliderRatings[avatarIndex]); // Push selected slider rating to selections
							currentSelection = avatarNumber; // Update current selection
			
							currentIndex = avatarNumberArray.indexOf(currentSelection);
							Trustworthiness = combinedTrustArray[currentIndex];
							avatarTrustworthiness.push(Trustworthiness);
			
							// <!-- Find positional index of the avatar --> //
							// Assuming you have an ID or a class for the parent div
							var parentDiv = document.getElementById('avatar-grid'); // or use document.querySelector if you have a class
							var childDivs = parentDiv.children; // or parentDiv.querySelectorAll('div') if you need a more specific selector
			
							// Function to find the index of a specific sub-div
							function findSubDivIndex(subDivId) {
								for (var i = 0; i < childDivs.length; i++) {
									if (childDivs[i].id === subDivId) { // or use another property to identify the sub-div
										return i; // Returns the index of the sub-div
									};
								};
								return -1; // Return -1 if the sub-div is not found
							};
			
							let avatarPositionIndex = findSubDivIndex('circle' + avatarNumber);
							avatarPositionIndices.push(avatarPositionIndex);
			
							let avatarPositionXIndex = avatarPositionIndex % 4;
							avatarPositionXIndices.push(avatarPositionXIndex);
			
							let avatarPositionYIndex = Math.floor(avatarPositionIndex / 4);
							avatarPositionYIndices.push(avatarPositionYIndex);
			
							// Disable other circles
							for (let j = 1; j <= 100; j++) {
								if (j !== i) {
									$("#circle" + j).addClass('disabled');
								};
							};
			
							$("#circle" + avatarNumber).css("background-color", "#bbb");  // Fades background color
							if (combinedTrustArray[avatarNumberArray.indexOf(avatarNumber)] === "avatar-circle-trustworthy") {
								$("#circle" + avatarNumber).css("border-color", "rgba(128, 130, 135, 0.5)");
							} else {
								$("#circle" + avatarNumber).css("border-color", "rgba(128, 130, 135, 0.5)");
							};
							$("#circle" + avatarNumber).find("img.avatar-photo").css("opacity", "0.5");  // Fades avatar photo
							initLearning(avatarIndex, avatarNumber);  // Start trial
							isLearningInProgress = false;
						};
					};
			
					$("#circle" + avatarNumber).on('click', clickHandler);
					clickHandlers[avatarIndex] = clickHandler;
			
					startTime = (new Date()).getTime(); // Store the start time
				})(avatarIndex);
			};
			
			// Function to reattach event listeners
			function reattachEventListeners() {
				for (let i = 1; i <= 100; i++) {
					$("#circle" + i).removeClass('disabled');
				};
				currentSelection = null; // Reset current selection for new phase
			};

			const endTrial = () => {
				const finalTime = (new Date()).getTime();
				const taskDuration = finalTime - startTime;
				const trial_data = {
				  "statement": trial.statement, //Collect statement information
				  "avatar_selections": avatarSelections.join(','), // Collect avatar selections
				  "avatar_position_indices": avatarPositionIndices.join(','),
				  "avatar_position_x_indices": avatarPositionXIndices.join(','),
				  "avatar_position_y_indices": avatarPositionYIndices.join(','),
				  "all_avatars": combinedTrustArray,
				  "trustworthy_avatars": trustworthyArray,
				  "untrustworthy_avatars": untrustworthyArray,
				  "selected_slider_ratings": selectedSliderRatings,
				  "avatar_trustworthiness": avatarTrustworthiness.join(','), // Collect trustworthiness information
				  "avatar_professions": avatarLabels.join(','), // Collect profession information
				  "click_rt_array": clickRtArray.join(','),
				  "view_rt_array": viewRtArray.join(','),
				  "task_duration": taskDuration
				};
				// console.log("Ending trial with data:", trial_data); // Comment this back in for debugging
				jsPsych.finishTrial(trial_data);
			  };
		};
	};

	SelectionLearningPlugin.info = info;

	return SelectionLearningPlugin;
})(jsPsychModule);

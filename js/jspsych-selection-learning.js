var jsPsychSelectionLearning = (function (jspsych) {
	"use strict";

	/**
	 * **SELECTION LEARNING**
	 *
	 * SHORT PLUGIN DESCRIPTION
	 *
	 * @author Nathan Liang
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
			},
			epistemicMoralCondition: {
				type: jspsych.ParameterType.STRING,
				pretty_name: "Epistemic or Moral Condition",
				default: undefined,
			}
		}
	};

	class SelectionLearningPlugin {
		constructor(jsPsych) {
			this.jsPsych = jsPsych;
		};

		trial(display_element, trial) {
			display_element.innerHTML +=
				// Pt. 1: Box
				`<div id="jspsych-instructions">
					<div class="quote">
						<h2>Search Task</h2>
						<p>
							Now you will have a chance to see what various health providers think. 
							Click on an avatar to see that provider's opinion on the following sentence:
						</p>
						<blockquote>
							${trial.statement}
						</blockquote>
					</div>
				</div>` +

				// Pt. 2: Box
				`<div id="trial-presentation-space" class="popup"></div><div id="overlay"></div>` +

				// Pt. 3: Prompt
				`<div id="prompt-container"></div>` +

				// Pt. 4: Avatar Grid
				`<div class="grid-container-wrapper">
					<div class="grid-container" id="avatar-grid"></div>
				</div>`;

			// Pre-Shuffled Ratings
			// 2 (Norm: Descriptive vs. Injunctive) x 2 (Politics: Democrat vs. Republican) x 2 (Contribution: High vs. Low)
			const selectionRatingsDict = {
				descriptiveDemocratLow: jsPsych.randomization.shuffle([
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
					0, 0, 0, 0, 0, 0, 0, 1, 3, 25, 25, 25, 50, 50, 50, 50, 50, 50, 50, 50, 100, 100, 100, 100, 100, 100, 
					100, 100, 100, 100, 100, 100, 100, 120, 125, 150, 150, 163, 175, 200, 200, 200, 200, 200, 200, 200, 
					200, 215, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					250, 250, 250, 250, 250, 250, 270, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300,
					300, 350, 350, 400, 400, 400, 400, 400, 400, 400, 400, 400, 450, 450, 499, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500
				]),

				descriptiveDemocratHigh: jsPsych.randomization.shuffle([
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
					0, 0, 0, 0, 0, 0, 0, 1, 3, 25, 25, 25, 50, 50, 50, 50, 50, 50, 50, 50, 100, 100, 100, 100, 100, 100, 
					100, 100, 100, 100, 100, 100, 100, 120, 125, 150, 150, 163, 175, 200, 200, 200, 200, 200, 200, 200, 
					200, 215, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					250, 250, 250, 250, 250, 250, 270, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300,
					300, 350, 350, 400, 400, 400, 400, 400, 400, 400, 400, 400, 450, 450, 499, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500
				]),

				descriptiveRepublicanLow: jsPsych.randomization.shuffle([
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
					0, 0, 0, 0, 0, 1, 5, 10, 20, 25, 50, 50, 50, 75, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 
					100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 150, 150, 150, 150, 175, 200, 200, 
					200, 200, 200, 200, 200, 230, 235, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 275, 300, 300, 
					300, 300, 300, 300, 300, 300, 300, 300, 300, 320, 325, 350, 350, 350, 350, 350, 400, 400, 400, 400, 
					400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 450, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500
				]),

				descriptiveRepublicanHigh: jsPsych.randomization.shuffle([
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
					0, 0, 0, 0, 0, 1, 5, 10, 20, 25, 50, 50, 50, 75, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 
					100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 150, 150, 150, 150, 175, 200, 200, 
					200, 200, 200, 200, 200, 230, 235, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 275, 300, 300, 
					300, 300, 300, 300, 300, 300, 300, 300, 300, 320, 325, 350, 350, 350, 350, 350, 400, 400, 400, 400, 
					400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 450, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500
				]),

				injunctiveDemocratLow: jsPsych.randomization.shuffle([
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42, 44, 49, 50, 50, 50, 50, 50, 92, 96, 97, 100, 100, 100, 100, 100,
					100, 100, 100, 100, 100, 100, 101, 125, 125, 142, 150, 165, 176, 183, 200, 200, 200, 200, 200, 200, 
					200, 200, 201, 203, 204, 217, 240, 240, 240, 249, 249, 250, 250, 250, 250, 250, 250, 250, 250, 250,
					 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 251, 251, 251, 251, 252, 252, 253, 253, 
					 254, 259, 263, 264, 271, 279, 286, 286, 300, 300, 300, 300, 300, 300, 300, 300, 301, 303, 304, 336, 
					 350, 351, 356, 358, 360, 400, 400, 400, 400, 400, 401, 425, 426, 433, 448, 456, 460, 493, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500
				]),

				injunctiveDemocratHigh: jsPsych.randomization.shuffle([
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42, 44, 49, 50, 50, 50, 50, 50, 92, 96, 97, 100, 100, 100, 100, 100,
					100, 100, 100, 100, 100, 100, 101, 125, 125, 142, 150, 165, 176, 183, 200, 200, 200, 200, 200, 200, 
					200, 200, 201, 203, 204, 217, 240, 240, 240, 249, 249, 250, 250, 250, 250, 250, 250, 250, 250, 250,
					 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 251, 251, 251, 251, 252, 252, 253, 253, 
					 254, 259, 263, 264, 271, 279, 286, 286, 300, 300, 300, 300, 300, 300, 300, 300, 301, 303, 304, 336, 
					 350, 351, 356, 358, 360, 400, 400, 400, 400, 400, 401, 425, 426, 433, 448, 456, 460, 493, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					 500, 500, 500, 500, 500, 500, 500
				]),

				injunctiveRepublicanLow: jsPsych.randomization.shuffle([
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 40, 46, 50, 50, 50, 50, 50, 50, 50, 94, 97, 98,
					99, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 101, 101, 110, 150, 150, 151, 152, 180, 180, 183, 
					193, 194, 195, 200, 200, 200, 200, 200, 200, 206, 210, 214, 243, 248, 250, 250, 250, 250, 250, 250, 250,
					250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 251, 251, 251, 251, 251, 251, 251, 251,
					251, 252, 253, 254, 255, 256, 257, 257, 261, 261, 264, 266, 266, 267, 272, 275, 290, 296, 300, 300, 300,
					300, 300, 301, 302, 303, 306, 307, 309, 320, 325, 327, 336, 342, 350, 351, 353, 361, 362, 363, 367, 369,
					400, 400, 400, 400, 400, 400, 400, 402, 406, 471, 499, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500
				]),
				
				injunctiveRepublicanHigh: jsPsych.randomization.shuffle([
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 40, 46, 50, 50, 50, 50, 50, 50, 50, 94, 97, 98,
					99, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 101, 101, 110, 150, 150, 151, 152, 180, 180, 183, 
					193, 194, 195, 200, 200, 200, 200, 200, 200, 206, 210, 214, 243, 248, 250, 250, 250, 250, 250, 250, 250,
					250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 
					250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 251, 251, 251, 251, 251, 251, 251, 251,
					251, 252, 253, 254, 255, 256, 257, 257, 261, 261, 264, 266, 266, 267, 272, 275, 290, 296, 300, 300, 300,
					300, 300, 301, 302, 303, 306, 307, 309, 320, 325, 327, 336, 342, 350, 351, 353, 361, 362, 363, 367, 369,
					400, 400, 400, 400, 400, 400, 400, 402, 406, 471, 499, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
					500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500
				]),
			};

			// Initialize trial presentation space
			const trialPresentationSpace = $('#trial-presentation-space');

			// Generate circles
			const avatarCircleContainer = $('#avatar-grid');


			// Avatar NUMBER randomized from 1 to 100; not index 0 to 99
			// EXAMPLE: [1, 3, 2, ..., 100]
			const randomizedAvatarNumberArray = jsPsych.randomization.shuffle([...Array(100).keys()].map (x => x + 1));

			let politicalAffiliationArray;
			let democratAffiliationArray;
			let republicanAffiliationArray;

			// Create an array populated with either 'avatar-circle-democrat' or 'avatar-circle-republican' depending on index
			// EXAMPLE: ['avatar-circle-democrat', 'avatar-circle-democrat', 'avatar-circle-republican', ..., 'avatar-circle-democrat']
			politicalAffiliationArray = jsPsych.randomization.shuffle(
				new Array(50).fill('avatar-circle-democrat').concat(new Array(50).fill('avatar-circle-republican'))
			);

			// Split into two arrays: 50 for Democrats
			// EXAMPLE: [0, 2, 4, ..., 98]
			// Get the indices of 'avatar-circle-democrat'
			democratAffiliationArray = politicalAffiliationArray.map((affiliation, index) => affiliation === 'avatar-circle-democrat' ? index : null).filter(index => index !== null);

			// ...and 50 for Republicans
			// EXAMPLE: [1, 3, 5, ..., 99]
			republicanAffiliationArray = politicalAffiliationArray.map((affiliation, index) => affiliation === 'avatar-circle-republican' ? index : null).filter(index => index !== null);
			
			// Create an array of labels, 50 for each party, and shuffle it
			if (politicalManipulation == "political") {

				for (let i = 0; i < 100; i++) {
					const avatarCircle = $(`<div class='avatar-circle clickable ${politicalAffiliationArray[i]}' id='circle${randomizedAvatarNumberArray[i]}'></div>`);
	
					avatarCircleContainer.append(avatarCircle);
					const circleId = $(`#circle${randomizedAvatarNumberArray[i]}`);
					const avatarPhoto = $(`<img class='avatar-photo' src='./avatars/avatar${randomizedAvatarNumberArray[i]}.webp'>`);
					circleId.append(avatarPhoto);
				};

			} else if (politicalManipulation == "nonpolitical") {
				
				for (let i = 0; i < 100; i++) {
					const avatarCircle = $(`<div class='avatar-circle clickable avatar-circle-none' id='circle${randomizedAvatarNumberArray[i]}'></div>`);

					avatarCircleContainer.append(avatarCircle);
					const circleId = $(`#circle${randomizedAvatarNumberArray[i]}`);
					const avatarPhoto = $(`<img class='avatar-photo' src='./avatars/avatar${randomizedAvatarNumberArray[i]}.webp'>`);
					circleId.append(avatarPhoto);
				}
			};


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

			let avatarPoliticalAffiliations = [];
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


			let targetArrayDemocrat;
			let targetArrayRepublican;
			

			// this takes the number of the avatar (e.g., #12) and uses the number (1 to 100) as an index to retrieve the rating number at that
			// "index" from the selectionRatings array's trial.trialIndex element. If the avatar is 12, then we actually are retrieving the 11th (12 - 1) index
			// However, the problem is that trial.trialIndex is not what we want. The order is not always 0 to 4 Roentgen, Akon, Gandhi, Lovelace, Turing.
			for (let i = 0; i < randomizedAvatarNumberArray.length; i++) {
				
				switch (normManipulation) {
					case "descriptive":
						if (contributionManipulation == "dHigh_rLow") {
							targetArrayDemocrat   = selectionRatingsDict['descriptiveDemocratHigh'];
							targetArrayRepublican = selectionRatingsDict['descriptiveRepublicanLow'];
						} else if (contributionManipulation == "rHigh_dLow") {
							targetArrayDemocrat   = selectionRatingsDict['descriptiveDemocratLow'];
							targetArrayRepublican = selectionRatingsDict['descriptiveRepublicanHigh'];
						}
						break;
						
					case "injunctive":
						if (contributionManipulation == "dHigh_rLow") {
							targetArrayDemocrat   = selectionRatingsDict['injunctiveDemocratHigh'];
							targetArrayRepublican = selectionRatingsDict['injunctiveRepublicanLow'];
						} else if (contributionManipulation == "rHigh_dLow") {
							targetArrayDemocrat   = selectionRatingsDict['injunctiveDemocratLow'];
							targetArrayRepublican = selectionRatingsDict['injunctiveRepublicanHigh'];
						}
						break;
				};
				
				// if i is a democrat's index, push the jth index rating from the 50 democrat ratings

				// if (politicalManipulation == "present") {
				var yokedIndex = randomizedAvatarNumberArray[i] - 1; // this is the number of the avatar, already shuffled
				if (democratAffiliationArray.includes(yokedIndex)) {
					sliderRatings.push(targetArrayDemocrat.shift());
				} else if (republicanAffiliationArray.includes(yokedIndex)) {
					sliderRatings.push(targetArrayRepublican.shift());
				};
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
					class: 'avatar-circle',
					id: `circle${avatarNumber}`
				}).appendTo(avatarContainer);

				if (politicalManipulation == "political") {
					avatarCircleSelection.addClass(politicalAffiliationArray[randomizedAvatarNumberArray.indexOf(avatarNumber)]);
				} else if (politicalManipulation == "nonpolitical") {
					avatarCircleSelection.addClass('avatar-circle-none');
				};

				// Create copy of the chosen avatar photo
				// Add it inside the avatar circle
				$('<img>', {
					src: `./avatars/avatar${avatarNumber}.webp`,
					class: 'avatar-photo'
				}).appendTo(avatarCircleSelection);

				let ratingPrompt;
				if (normManipulation == "descriptive") {
					ratingPrompt = `Contribution amount: ${sliderRatings[avatarIndex]} points`;
				} else if (normManipulation == "injunctive") {
					ratingPrompt = `Preferred contribution amount: ${sliderRatings[avatarIndex]} points`;
				};
				const textDownRating = "0 points";
				const textUpRating   = "500 points";

				const labelElement = $('<label>', {
					for: "rating-slider",
				}).text(ratingPrompt);

				// Step 1: Create the input element with initial attributes
				const inputElement = $('<input>', {
					name: 'rating-slider',
					type: 'range',
					class: 'jspsych-slider bipolar-clicked',
					value: sliderRatings[avatarIndex],
					min: 0,
					max: 500,
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
						min: 0,
						max: 500,
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
						};
					} else {
						for (let i = 0; i < trial.choices.length; i++) {
							buttons.push(trial.button_html);
						};
					};
					trialPresentationSpace.html(trialFormat);

					trialFeedback.html(`
						<hr></hr>
						<p>Would you like to continue sampling?</p>
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
					};
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

				}, 1000); //changed this from 5000 to 3000 for the pilot because it feels very long, now 1000
			};

			const clickHandlers = {};
			let currentSelection = null; // Track the current selection

			for (let avatarIndex = 0; avatarIndex < 100; avatarIndex++) {
				(function (i) {
					let avatarNumber = avatarIndex + 1;
					let isLearningInProgress = false; // Flag variable
					const clickHandler = function () {

						let currentIndex; 
						let politicalAffiliaton;

						if (currentSelection !== avatarNumber) {
							// <!-- Find actual index of the avatar --> //
							avatarSelections.push(avatarNumber); // Push circle index to selections
							selectedSliderRatings.push(sliderRatings[avatarIndex]); // Push selected slider rating to selections
							currentSelection = avatarNumber; // Update current selection

							if (politicalManipulation == "political") {
								currentIndex = randomizedAvatarNumberArray.indexOf(currentSelection);
								politicalAffiliaton = politicalAffiliationArray[currentIndex]
								avatarPoliticalAffiliations.push(politicalAffiliaton);
							};

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

							let selectedSliderRating = sliderRatings[avatarNumber];
							selectedSliderRatings.push(selectedSliderRating);
						};

						if (!isLearningInProgress && !this.classList.contains('disabled')) {

							isLearningInProgress = true; // Set flag to indicate learning is in progress

							// Disable other circles
							for (let j = 1; j <= 100; j++) {
								if (j !== i) {
									$("#circle" + j).addClass('disabled');
								};
							};

							$("#circle" + avatarNumber).css("background-color", "#bbb");  // Fades background color
							if (politicalManipulation == "political") {
								if (politicalAffiliationArray[currentIndex] == "avatar-circle-democrat") {
									$("#circle" + avatarNumber).css("border-color", "rgba(1, 67, 202, 0.5)");
								} else if (politicalAffiliationArray[currentIndex] == "avatar-circle-republican") {
									$("#circle" + avatarNumber).css("border-color", "rgba(232, 27, 35, 0.5)");
								}
							} else if (politicalManipulation == "nonpolitical") {
								$("#circle" + avatarNumber).css("border-color", "rgba(0, 0, 0, 0.5)");
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
					$("#circle" + i)
						.removeClass('disabled')
						.on('click', clickHandlers[i]);
				};
				currentSelection = null; // Reset current selection for new phase
			};

			const endTrial = () => {
				const finalTime = (new Date()).getTime();
				const taskDuration = finalTime - startTime;
				const trial_data = {
					"avatar_selections": avatarSelections.join(','),
					"avatar_position_indices": avatarPositionIndices.join(','),
					"avatar_position_x_indices": avatarPositionXIndices.join(','),
					"avatar_position_y_indices": avatarPositionYIndices.join(','),
					"all_political_avatars": politicalAffiliationArray,
					"democrat_avatars": democratAffiliationArray,
					"republican_avatars": republicanAffiliationArray,
					"selected_slider_ratings": selectedSliderRatings,
					"click_rt_array": clickRtArray.join(','),
					"view_rt_array": viewRtArray.join(','),
					"task_duration": taskDuration
				};
				jsPsych.finishTrial(trial_data);
			};
		};
	};

	SelectionLearningPlugin.info = info;

	return SelectionLearningPlugin;
})(jsPsychModule);
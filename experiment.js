// DEFINE GLOBAL VARIABLES
let timeline = [];

// jsPsych Initialization
const jsPsych = initJsPsych({
  use_webaudio: false,
  display_element: 'jspsych-target',
  show_progress_bar: true,
  default_iti: 0,
  on_finish: function (data) {
    jsPsych.data.displayData('csv');
  }
});

const participantId = jsPsych.data.getURLVariable('PROLIFIC_PID');
const studyId = jsPsych.data.getURLVariable('STUDY_ID');
const sessionId = jsPsych.data.getURLVariable('SESSION_ID');

// Random assignment of manipulations
// Injunctive vs. Descriptive
const normManipulation = jsPsych.randomization.sampleWithoutReplacement(['injunctive', 'descriptive'], 1)[0];

// Political vs. Non-Political
const politicalManipulation = jsPsych.randomization.sampleWithoutReplacement(['political', 'nonpolitical'], 1)[0];

// High vs. Low Party Contribution
const contributionManipulation = jsPsych.randomization.sampleWithoutReplacement(['dHigh_rLow', 'rHigh_dLow'], 1)[0];

// Concatenate individual manipulation outcomes to create composite condition variable
const condition = normManipulation + "_" + politicalManipulation + "_" + contributionManipulation;

// Treatment vs. Control
const expcondition = jsPsych.randomization.sampleWithoutReplacement(['treatment', 'control'], 1)[0];

// Random assignment of statements: pick 5 of 18 statements
const trials = jsPsych.randomization.shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]).slice(0, 5);


jsPsych.data.addProperties({
  trials: trials,
  participantId: participantId,
  studyId: studyId,
  sessionId: sessionId,
  expcondition: expcondition
});

// const filename = `${participantId}` + "_" + `${studyId}` + "_" + `${sessionId}.csv`;
const filename = "debug.csv"

// Options
const valueOpinionOptions = ['Yes', 'Somewhat', 'No'];

// Belief options
const beliefOptions = ['Definitely false', '', '', '', '','', 'Defintely True'];

// Statements
const statements = [
  `"You can test positive for HPV as a result of receiving the HPV vaccine."`,
  `"Vaccines can cause sudden infant death syndrome (SIDS)."`,
  `"The chickenpox vaccine can cause infertility."`,
  `"The tetanus vaccine weakens your immune system over time, making you more susceptible to infections."`,
  `"The measles, mumps, and rubella (MMR) vaccine contains toxic levels of mercury."`,
  `"If everyone in a community is vaccinated, it is impossible for anyone to get the disease again."`,
  `"Getting vaccinated against one disease can protect you against unrelated diseases."`,
  `"Vaccines can cure chronic illnesses if they target the underlying virus or bacteria."`,
  `"Certain vaccines can alter your DNA."`,
  `"Vaccines made using mRNA technology have been researched for decades."`,
  `"You can safely receive multiple vaccines in one visit without overwhelming your immune system."`,
  `"The smallpox vaccine led to the complete eradication of the disease."`,
  `"The rabies vaccine can be administered after exposure to the virus and still prevent the disease."`,
  `"The Hepatitis B vaccine can prevent the development of liver cancer."`,
  `"It can take several weeks for certain vaccines to reach their full efficacy."`,
  `"Live vaccines, such as the measles or yellow fever vaccine, can cause infection in immunosuppressed individuals."`,
  `"In rare cases, vaccines can trigger autoimmune reactions."`,
  `"The effectiveness of the whooping cough (pertussis) vaccine can decrease over time."`,
];

// Political Ideology
const politicalResponses = [
  "1 = Extremely liberal",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 = Extremely conservative",
];

// Experimenter Demand Effects
const demandEffectsResponses = [
  "1 = Not at all",
  "2",
  "3",
  "4",
  "5 = Very much so"
];

// ENTER FULLSCREEN //
const enterFullscreen = {
  type: jsPsychFullscreen,
  name: 'enter_fullscreen',
  fullscreen_mode: true,
  delay_after: 0
};

timeline.push(enterFullscreen)

// CONSENT FORM //
const consentForm = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'consent',
      prompt: `
            <p style="text-align: left;">
              We would like to invite you to take part in an online research project. 
              The purpose of this research is to investigate how people process health information. 
            </p>
            <p style="text-align: left;">
            <ul>
              <li>You must be at least 18 years old to take part in this research.</li>
              <li>The study will take approximately 3-4 minutes to complete.</li>
              <li>You will receive $0.70 for your participation in the study.</li>
              <li>The possible risks or discomforts of the study are minimal. You may feel uncomfortable reflecting on and answering some questions.</li>
              <li>There are no direct benefits for participating in the study.</li>
              <li>Your part in this study will be handled in a confidential manner. 
              Only the researchers will know that you participated in this study. 
              Any reports or publications based on this research will use only group data and will not identify you or any individual as being part of this project. 
              The only individually-identifying data we receive from Prolific are your unique identifier and your country.</li>
              <li>The decision to participate in this research project is up to you. You do not have to participate.</li>
              <li>Even if you begin the study, you may withdraw at any time. If you do not complete the survey submission, you will not be paid.</li>
            </ul>
            </p>
            <p style="text-align: left;">
              If you have any questions regarding electronic privacy, please feel free to contact Northeastern University’s 
              Office of Information Security via phone at 617-373-7901, or via email at <a href="mailto:privacy@neu.edu">privacy@neu.edu</a>.
            </p>
            <p style="text-align: left;">
              If you have any questions about this study, please feel free to contact the Principal Investigator 
              Briony Swire-Thompson at b.swire-thompson@northeastern.edu; the person mainly responsible for the research. 
              If you have any questions about your rights as a research subject, you can contact Northeastern University’s 
              Office of Human Subject Research Protection at irb@neu.edu or 617-373-4588. You may call anonymously if you wish.
            </p>
            <p style="text-align: left;">
              This study has been reviewed and approved by the Northeastern University Institutional Review Board (#20-12-16).
            </p>
            <p style="text-align: left;">
              <b>If you do not wish to consent, please exit this website now.</b>
            </p>
            <p style="text-align: left;">
            By clicking on the “Consent given” button below you are indicating that you consent to participate in this study. 
            Please print out a copy of this consent screen or download a copy of the consent form for your records.
            </p>`,
      options: ["Consent not given", "Consent given"],
      horizontal: true,
      required: true
    }
  ],
  preamble: '<h2 style="text-align: center"><strong>Request to Participate in Research</strong></h2>',

  // If the participant does not consent, end the experiment
  on_finish: function (data) {
    if (jsPsych.data.get().last(1).values()[0].response.consent == "Consent not given") {
      jsPsych.endExperiment(
        `<p class="jspsych-center">
          You did not consent to participate in this study.<br>
          Please return this study in Prolific.
        </p>`
      );
    }
  }
};

timeline.push(consentForm);

// Pre-sampling belief ratings for only the selected trials
const preBelief = {
  type: jsPsychSurveyMultiChoice,
  preamble: `<p><strong>First, please rate the extent to which you believe each claim is true (vs false).</strong></p>`,
  questions: trials.map((index) => ({
    name: `preBelief${index + 1}`,
    prompt: `<blockquote>${statements[index]}</blockquote>`,
    options: ["Strongly Disagree","","","","","","Strongly Agree"],
    required: true,
    horizontal: true,
  })),
  randomize_question_order: true
};

// // USE THIS INSTEAD IF PARTICIAPNTS SHOULD RATE ALL 18 STATEMENTS, NOT JUST THE ONES THEY'LL SAMPLE FOR
// const preBelief = {
//   type: jsPsychSurveyMultiChoice,
//   preamble: `<p><strong>First, please rate the extent to which you believe each claim is true (vs false).</strong></p>`,
//   questions: statements.map((statement, index) => ({
//     name: `preBelief${index + 1}`,
//     prompt: `<blockquote>${statement}</blockquote>`,
//     options: ["Strongly Disagree","","","","","","Strongly Agree"],
//     required: true,
//     horizontal: true,
//   })),
//   randomize_question_order: true
// };


// Pre-sampling belief
timeline.push(preBelief);

// Pre-intervention instructions
const preIntInstructions = {
  type: jsPsychInstructions,
  pages: [`
        <p style="text-align: left;">
          Thank you for answering those questions.
        </p>
        <p style="text-align: left;">
        On the next page you will receive some additional information.
        Please read the information carefully before continuing.
        </p>`
  ],
  show_clickable_nav: true,
};

// Pre-intervention instructions
timeline.push(preIntInstructions);

// Intervention //
const InterventionImage = {
  type: jsPsychInstructions,
  pages: [`
        <p style="text-align: left;">
          <img src="intervention/intervention.webp" alt="Intervention Image" style="width: 100%;"/>
        </p>`
  ],
  show_clickable_nav: true,
};

// Control //
const ControlImage = {
  type: jsPsychInstructions,
  pages: [`
        <p style="text-align: left;">
          <img src="intervention/control.webp" alt="Control Image" style="width: 100%;"/>
        </p>`
  ],
  show_clickable_nav: true,
};

// Receive intervention or control
if (expcondition === 'treatment') {
  timeline.push(
    InterventionImage,
  );
} else if (expcondition === 'control') {
  timeline.push(
    ControlImage,
  );
};



// Instructions //
const preSamplingInstructions = {
  type: jsPsychInstructions,
  pages: [`
        <p style="text-align: left;">
        Now you get to see what people of various professions have to say. 
        The avatars below represent people with the professions listed. 
        Every time you click on an avatar, you will see whether that person 
        thought the claim above was true or false. You can view the opinions 
        of as many people as you would like before moving on.
        </p>`
  ],
  show_clickable_nav: true,
};

timeline.push(preSamplingInstructions);




function selectionTask(trialIndex, epistemicMoralCondition) {
  return {
    type: jsPsychSelectionLearning,
    trialIndex: trialIndex,
    avatars: avatarDictionary,
    epistemicMoralCondition: epistemicMoralCondition,
    statement: statements[trials[trialIndex]],
    choices: [
      "<i class='fa-solid fa-rotate-left'></i>&nbsp;&nbsp;Continue sampling",
      "<i class='fa-solid fa-circle-check' style='color: green'></i>&nbsp;&nbsp;I'm all done"
    ]
  };
};


const avatarNames = Array.from({ length: 100 }, (_, i) => "avatar" + i);
const avatarPhotos = Array.from({ length: 100 }, (_, i) => `./avatars/avatar${i + 1}.webp`);

let avatarDictionary = {};

for (let i = 0; i < 100; i++) {
  let avatarData = { avatar: avatarPhotos[i] };
  avatarDictionary[avatarNames[i + 1]] = avatarData;

  let avatarName = 'image' + i;
  let avatar = avatarDictionary[avatarNames[i + 1]].image;

  selectionTask = Object.assign(selectionTask, { [avatarName]: avatar });
};

// Sampling Task
timeline.push(selectionTask())


const contributionPGG = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
    <p>Now it is time to play the game.</p>
    <p>You have received 500 points. In the upcoming days you will be randomly grouped with 3 other participants, 
    forming a group of 4. The other 3 participants will have also received 500 points each.</p>
    <p>Your task is to decide how much money to transfer to the 'common pool'. 
    You can transfer any amount from 0 to 500 points, including 0 and 500. 
    Each of the other 3 participants will make a decision about their transfer to the common pool.</p>
    <p>After all 4 participants in your group have reached a decision, 
    the transfers to the common pool are summed. Then, this sum is doubled. 
    Finally, the doubled sum in the common pool is divided equally between the 4 participants in your group. 
    You will receive your payoff in the upcoming days.</p>
    <p>Please indicate in the box below how many points to transfer to the common pool.</p>
    <br>Your contribution to the common pool:<br>
  `,
  html: `
    <div class="jspsych-survey-multi-choice-question">
      <label for="contribution">Your contribution to the common pool:</label><br>
      <input 
        type="number" 
        id="contribution" 
        name="contribution" 
        min="0" max="500" 
        style="padding: 5px; width: 60px;" 
        required"
      >
    </div>
  `,

  button_label: 'Next',
  on_finish: function (data) {
    const contribution = Number(data.response.contribution);

    // Safeguard: Ensure a valid contribution is logged
    const contributionPGGData = {
      contribution: isNaN(contribution) ? 0 : contribution
    };

    // Add the data to the current trial's node
    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(contributionPGGData);
  }
};

// Add the task to the timeline
timeline.push(contributionPGG);


// DEMOGRAPHICS //
const demographicsQuestions = {
  type: jsPsychSurveyHtmlForm,
  preamble:
    `<p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  html: `
        <!-- Age -->

        <div class="jspsych-survey-multi-choice-question">
          <label for="age">How old are you?</label><br>
          <input 
            type="number" 
            id="age" 
            name="age" 
            min="18" max="100" 
            style="padding: 5px; width: 40px;" 
            class="incomplete"
            oninput="this.classList.remove('incomplete');"
          >
        </div>
        

        <!-- Race/Ethnicity -->

        <div class="jspsych-survey-multi-choice-question">
          <legend>Please indicate how you identify yourself:</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-indigenous" 
              name="race-ethnicity-indigenous" 
              value="Indigenous American or Alaskan Native" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-indigenous">Indigenous American or Alaskan Native</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-asian" 
              name="race-ethnicity-asian" 
              value="Asian or Asian-American" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-asian">Asian or Asian-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-black" 
              name="race-ethnicity-black" 
              value="African-American or Black" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-black">African-American or Black</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-native" 
              name="race-ethnicity-native" 
              value="Native Hawaiian or Pacific Islander" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-native">Native Hawaiian or other Pacific Islander</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-white" 
              name="race-ethnicity-white" 
              value="White" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-white">White</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-hispanic" 
              name="race-ethnicity-hispanic" 
              value="Hispanic/Latino/a/x" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-hispanic">Hispanic/Latino/a/x</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-other" 
              name="race-ethnicity-other" 
              value="Other" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox"
              id="race-ethnicity-prefer-not" 
              name="race-ethnicity-prefer-not" 
              value="Prefer not to disclose" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-prefer-not">Prefer not to disclose</label>
          </div>
        </div>


        <!-- Gender -->
        
        <div class="jspsych-survey-multi-choice-question">
          <legend>With which gender do you most closely identify?</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-man" 
              name="gender" 
              value="Man" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-man">Man</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-woman" 
              name="gender" 
              value="Woman" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-woman">Woman</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-non-binary" 
              name="gender" 
              value="Non-binary" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-non-binary">Non-binary</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-other" 
              name="gender" 
              value="Other" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-prefer-not" 
              name="gender" 
              value="Prefer not to disclose" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-prefer-not">Prefer not to disclose</label>
          </div>
        </div>


        <!-- Education -->
        
        <div class="jspsych-survey-multi-choice-question">
          <legend>
            What is the highest level of education you have received? 
            (If you are currently enrolled in school, please indicate the highest degree you have received)
          </legend>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-less-high-school" 
              name="education" 
              value="Less than a high school diploma" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-less-high-school">
              Less than a high school diploma
            </label>
          </div>

          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-high-school" 
              name="education" 
              value="High school degree or equivalent (e.g. GED)" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-high-school">
              High school degree or equivalent (e.g. GED)
            </label>
          </div>

          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-some-college" 
              name="education" 
              value="Some college, no degree" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-some-college">
              Some college, no degree
            </label>
          </div>

          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-associate" 
              name="education" 
              value="Associate Degree (e.g. AA, AS)" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-associate">
              Associate Degree (e.g. AA, AS)
            </label>
          </div>

          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-bachelors" 
              name="education" 
              value="Bachelor's Degree (e.g. BA, BS)" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-bachelors">
              Bachelor's Degree (e.g. BA, BS)
            </label>
          </div>
          
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-postgraduate" 
              name="education" 
              value="Postgraduate Degree (e.g. Master's Degree, Professional Degree, Doctorate Degree)" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-postgraduate">
              Postgraduate Degree (e.g. Master's Degree, Professional Degree, Doctorate Degree)
            </label>
          </div>
        </div>
        
        <style id="jspsych-survey-multi-choice-css">
          .jspsych-survey-multi-choice-question { 
            margin-top: 2em; 
            margin-bottom: 2em; 
            text-align: left; 
          } .jspsych-survey-multi-choice-option { 
            font-size: 10pt; 
            line-height: 2; 
          } .jspsych-survey-multi-choice-horizontal 
            .jspsych-survey-multi-choice-option { 
            display: inline-block; 
            margin-left: 1em; 
            margin-right: 1em; 
            vertical-align: top; 
            text-align: center; 
          } label.jspsych-survey-multi-choice-text input[type='radio'] {
            margin-right: 1em;
          }
        </style>
      `,
  button_label: 'Next',
  request_response: true,
  on_finish: function (data) {
    let demographicsData = data.response;

    // Age
    const age = Number(demographicsData['age']);

    // Gender
    let gender = '';
    if (demographicsData['gender-man']) {
      gender = 'Man';
    } else if (demographicsData['gender-woman']) {
      gender = 'Woman';
    } else if (demographicsData['gender-non-binary']) {
      gender = 'Non-Binary';
    } else if (demographicsData['gender-other']) {
      gender = 'Other';
    }

    // Create a new object with the formatted data
    demographicsData = {
      age: age,
      race_ethnicity_indigenous: demographicsData['race-ethnicity-indigenous'],
      race_ethnicity_asian: demographicsData['race-ethnicity-asian'],
      race_ethnicity_black: demographicsData['race-ethnicity-black'],
      race_ethnicity_native: demographicsData['race-ethnicity-native'],
      race_ethnicity_white: demographicsData['race-ethnicity-white'],
      race_ethnicity_hispanic: demographicsData['race-ethnicity-hispanic'],
      race_ethnicity_other: demographicsData['race-ethnicity-other'],
      race_ethnicity_na: demographicsData['race-ethnicity-prefer-not'],
      gender: gender
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(demographicsData);
  }
};

timeline.push(demographicsQuestions);


const politicsQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'political-ideology-economic',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>economic</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political-ideology-social',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>social</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political-ideology-overall',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your <strong>overall</strong> political beliefs?
            </p>`,
      options: politicalResponses,
      horizontal: true
    }
  ],
  preamble: `
        <p class="jspsych-survey-multi-choice-preamble">
          Please answer the following questions about your political ideology:
        </p>`,
  request_response: true,
  on_finish: function (data) {
    let politicalData = data.response;

    politicalData = {
      political_ideology_economic: politicalData['political-ideology-economic'],
      political_ideology_social: politicalData['political-ideology-social'],
      political_ideology_overall: politicalData['political-ideology-overall']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(politicalData);
  }
};

timeline.push(politicsQuestions);


const demandEffectsQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'pressure',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
            Did you feel pressure to respond in a particular way to any of the questions?
          </p>`,
      options: demandEffectsResponses,
      horizontal: true
    },
    {
      name: 'judgment',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
            Did you feel as though you might be judged for your responses to the questions you answered?
          </p>`,
      options: demandEffectsResponses,
      horizontal: true
    }
  ],
  randomize_question_order: true,
  request_response: true,
  scale_width: 500,
  preamble:
    `<p class="jspsych-survey-multi-choice-preamble">
        For these final questions, please answer as honestly as you can.
        The answers to these questions will <strong>not</strong> affect whether or not you receive credit/payment for participation!
      </p>`,
  on_finish: function (data) {
    let demandEffectsData = data.response;

    demandEffectsData = {
      pressure: demandEffectsData['pressure'],
      judgment: demandEffectsData['judgment']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(demandEffectsData);
  }
};

timeline.push(demandEffectsQuestions);


// Guess Study Purpose / Questions + Comments
const feedback = {
  type: jsPsychSurveyText,
  questions: [
    {
      name: 'guess-study-purpose',
      prompt: 'What do you think this study was about?',
      columns: 100,
      rows: 10
    },
    {
      name: 'feedback',
      prompt: 'Do you have any additional comments? We appreciate any and all feedback!',
      columns: 100,
      rows: 10
    }
  ],
  on_finish: function (data) {
    let purposeFeedbackData = data.response;

    purposeFeedbackData = {
      guess_study_purpose: purposeFeedbackData['guess-study-purpose'],
      feedback: purposeFeedbackData['feedback']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(purposeFeedbackData);
  }
}

timeline.push(feedback);

// Exit fullscreen
const exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0
};

timeline.push(exitFullscreen);

// Choose from among these to relay via DataPipe
const preregisteredExperimentId = "jWr5Nul5HYl2";
const debugExperimentId = "XyR978iH6AOX";

// DataPipe conclude data collection
const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: debugExperimentId,
  filename: filename,
  data_string: () => jsPsych.data.get().csv(),
  on_finish: function (data) {
    function countdown(start, end) {
      const timer = setInterval(function () {
        if (start <= end) {
          clearInterval(timer);
        } else {
          start--;
          document.getElementById("countdown").innerHTML = start;
        }
      }, 1000);
    }

    countdown(5, 0);

    jsPsych.endExperiment(
      `<p class="jspsych-center">
        Thanks for participating! You will be redirected in <span id="countdown">5</span> seconds.
      </p>`
    );
    setTimeout(function () {
      window.location.href = "https://app.prolific.com/submissions/complete?cc=CNN3F4P4";
    }, 5000)
  }
};

timeline.push(save_data);

// Preload all images
const imageSet = avatarPhotos;

jsPsych.pluginAPI.preloadImages(imageSet, function () {
  startExperiment();
});

// Function to initialize the experiment; will be called once all images are preloaded
function startExperiment() {
  jsPsych.run(timeline);
};
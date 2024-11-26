document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    const moodButtons = document.querySelectorAll('.mood-btn');
    const noteInput = document.getElementById('note');
    const saveButton = document.getElementById('save-btn');
    const todayMood = document.getElementById('today-mood');
    const yourMoods = document.getElementById('your-moods');
    const goalsList = document.getElementById('goals-list');
    const triggersList = document.getElementById('triggers-list');
    const sleepLog = document.getElementById('sleep-log');
    const medLog = document.getElementById('med-log');
    const goalInput = document.getElementById('goal');
    const triggerInput = document.getElementById('trigger-input');
    const sleepHoursInput = document.getElementById('sleep-hours');
    const medForm = document.getElementById('med-form');
    const exportBtn = document.getElementById('export-btn'); // Get export button

    // Initialize data arrays
    let moodData = [];
    let goals = [];
    let triggers = [];
    let sleepLogData = [];
    let medLogData = [];

    // Load saved data from localStorage
    const loadData = () => {
        const savedMoodData = localStorage.getItem('moodData');
        const savedGoals = localStorage.getItem('goals');
        const savedTriggers = localStorage.getItem('triggers');
        const savedSleepLog = localStorage.getItem('sleepLog');
        const savedMedLog = localStorage.getItem('medLog');

        if (savedMoodData) moodData = JSON.parse(savedMoodData);
        if (savedGoals) goals = JSON.parse(savedGoals);
        if (savedTriggers) triggers = JSON.parse(savedTriggers);
        if (savedSleepLog) sleepLogData = JSON.parse(savedSleepLog);
        if (savedMedLog) medLogData = JSON.parse(savedMedLog);
    };

    // Function to display today's mood
    function displayTodaysMood() {
        const today = new Date().toLocaleDateString();
        const todayMoodEntry = moodData.find(entry => entry.date === today);

        todayMood.innerHTML = ''; // Clear previous content

        if (todayMoodEntry) {
            todayMood.innerHTML = `
                <div>
                    <strong>Date:</strong> ${todayMoodEntry.date}<br>
                    <strong>Mood:</strong> ${todayMoodEntry.mood}<br>
                    <strong>Note:</strong> ${todayMoodEntry.note}<br>
                    <strong>Goals:</strong> ${getGoalsForToday(today)}<br>
                    <strong>Triggers:</strong> ${getTriggersForToday(today)}<br>
                    <strong>Hours Slept:</strong> ${getTodaySleepHours(today)}<br>
                    <strong>Medications:</strong> ${getTodayMedications(today)}
                </div>
            `;
        } else {
            todayMood.innerHTML = '<div>No mood recorded for today.</div>';
        }
    }

    // Helper functions
    function getGoalsForToday(today) {
        const todayGoals = goals.filter(g => g.date === today);
        return todayGoals.length > 0 
            ? todayGoals.map(g => g.text).filter(Boolean).join(', ') 
            : 'No goals for today';
    }

    function getTriggersForToday(today) {
        const todayTriggers = triggers.filter(t => t.date === today);
        return todayTriggers.length > 0 
            ? todayTriggers.map(t => t.text).filter(Boolean).join(', ') 
            : 'No triggers noted';
    }

    function getTodaySleepHours(today) {
        const todaySleepEntries = sleepLogData.filter(entry => entry.date === today);
        return todaySleepEntries.length > 0 
            ? todaySleepEntries.map(entry => entry.hours).filter(Boolean).join(', ') 
            : 'No sleep data for today';
    }

    function getTodayMedications(today) {
        const todayMedEntries = medLogData.filter(entry => entry.date === today);
        if (todayMedEntries.length > 0) {
            return todayMedEntries.map(entry => {
                const name = entry.name || '';
                const dosage = entry.dosage || '';
                const frequency = entry.frequency || '';
                const details = [name && `${name}`, dosage && `(${dosage})`, frequency && `${frequency}`].filter(Boolean).join(', ');
                return details ? `${entry.date}: ${details}` : '';
            }).filter(Boolean).join(', ');
        }
        return 'No medication logged for today';
    }

           // Function to display past moods
           function displayPastMoods() {
            yourMoods.innerHTML = moodData.map(entry => `
                <div>
                    <span>Date: ${entry.date}</span>
                    <span> Mood: ${entry.mood}</span>
                    <span> Note: ${entry.note}</span>
                </div>
            `).join('') || '<div>No past moods recorded.</div>';
        }

        // Function to display goals
        function displayGoals() {
            if (goals.length > 0) {
                goalsList.innerHTML = goals.map(goal => {
                    const date = goal.date || '';
                    const text = goal.text || '';
                    return text ? `${date}: ${text}` : '';
                }).filter(Boolean).join(', ');
            } else {
                goalsList.innerHTML = '<div>No goals recorded.</div>';
            }
        }

        // Function to display triggers
        function displayTriggers() {
            if (triggers.length > 0) {
                triggersList.innerHTML = triggers.map(trigger => {
                    const date = trigger.date || '';
                    const text = trigger.text || '';
                    return text ? `${date}: ${text}` : '';
                }).filter(Boolean).join(', ');
            } else {
                triggersList.innerHTML = '<div>No triggers recorded.</div>';
            }
        }

        // Function to display sleep log
        function displaySleepLog() {
            sleepLog.innerHTML = sleepLogData.length > 0 
                ? sleepLogData.map(entry => `<div>Date: ${entry.date}, Hours: ${entry.hours}</div>`).join('') 
                : '<div>No sleep data recorded.</div>';
        }

        // Function to display medication log
        function displayMedLog() {
            medLog.innerHTML = medLogData.length > 0 
                ? medLogData.map(entry => {
                    const date = entry.date || '';
                    const name = entry.name || '';
                    const dosage = entry.dosage || '';
                    const frequency = entry.frequency || '';
                    const details = [name && `${name}`, dosage && `(${dosage})`, frequency && `${frequency}`].filter(Boolean).join(', ');
                    return details ? `${date}: ${details}` : '';
                }).filter(Boolean).join(', ') 
                : '<div>No medication logged.</div>';
        }

        // Event listener for the save button
        saveButton.addEventListener('click', () => {
            const selectedMood = document.querySelector('.mood-btn.selected')?.dataset.mood;
            const note = noteInput.value;
            const today = new Date().toLocaleDateString();

            // Save mood entry for today
            if (selectedMood) {
                const todayMoodEntry = moodData.find(entry => entry.date === today);
                if (todayMoodEntry) {
                    // Update existing entry for today
                    todayMoodEntry.mood = selectedMood;
                    todayMoodEntry.note = note;
                } else {
                    // Create new entry for today
                    const moodEntry = { date: today, mood: selectedMood, note };
                    moodData.unshift(moodEntry);
                }
                localStorage.setItem('moodData', JSON.stringify(moodData));
            }

            // Save goals with date
            const goal = goalInput.value.trim();
            if (goal) {
                goals.unshift({ date: today, text: goal });
                localStorage.setItem('goals', JSON.stringify(goals));
                goalInput.value = ''; // Clear input after saving
            }

            // Save triggers with date
            const trigger = triggerInput.value.trim();
            if (trigger) {
                triggers.unshift({ date: today, text: trigger });
                localStorage.setItem('triggers', JSON.stringify(triggers));
                triggerInput.value = ''; // Clear input after saving
            }

            // Save sleep hours
            const hoursSlept = sleepHoursInput.value.trim();
            if (hoursSlept) {
                const sleepEntry = { date: today, hours: hoursSlept };
                sleepLogData.unshift(sleepEntry);
                localStorage.setItem('sleepLog', JSON.stringify(sleepLogData));
                sleepHoursInput.value = ''; // Clear input after saving
            }

            // Save medication with date
            const medName = document.getElementById('med-name').value;
            const medDosage = document.getElementById('med-dosage').value;
            const medFrequency = document.getElementById('med-frequency').value;
            if (medName && medDosage && medFrequency) {
                const medEntry = { date: today, name: medName, dosage: medDosage, frequency: medFrequency };
                medLogData.unshift(medEntry);
                localStorage.setItem('medLog', JSON.stringify(medLogData));
                medForm.reset(); // Clear form after saving
            }

                  // Update displays
                  displayTodaysMood();
                  displayPastMoods();
                  displayGoals();
                  displayTriggers();
                  displaySleepLog();
                  displayMedLog();
              });
      
              // Event listener for mood buttons
              moodButtons.forEach(button => {
                  button.addEventListener('click', () => {
                      const selectedMood = button.dataset.mood;
                      moodButtons.forEach(btn => btn.classList.remove('selected'));
                      button.classList.add('selected');
                      document.body.classList.remove(...['amused', 'calm', 'confident', 'tired', 'excited']);
                      document.body.classList.add(selectedMood);
                  });
              });
      
              // Event listener for export button
              exportBtn.addEventListener('click', exportData);
      
              function exportData() {
                // Get the data from the page
                const todayMood = document.getElementById('today-mood').innerHTML;
                const yourMoods = document.getElementById('your-moods').innerHTML;
                const goalsList = document.getElementById('goals-list').innerHTML;
                const triggersList = document.getElementById('triggers-list').innerHTML;
                const sleepLog = document.getElementById('sleep-log').innerHTML;
                const medLog = document.getElementById('med-log').innerHTML;
            
                // Create a JSON object
                const data = {
                    todayMood,
                    yourMoods,
                    goalsList,
                    triggersList,
                    sleepLog,
                    medLog
                };
            
                // Convert the JSON object to a string
                const jsonData = JSON.stringify(data);
            
                // Create a blob with the JSON data
                const blob = new Blob([jsonData], { type: 'application/json' });
            
                // Create a link to download the file
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'mood_tracker_data.json';
                link.click();
            }
              // Initial displays
              loadData();
              displayPastMoods();
              displayTodaysMood();
              displayGoals();
              displayTriggers();
              displaySleepLog();
              displayMedLog();
          });
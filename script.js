class MeditationTimer {
    constructor() {
        this.timerDisplay = document.getElementById('timer');
        this.stageNameDisplay = document.getElementById('stageName');
        this.progressBar = document.getElementById('progress');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.addStageBtn = document.getElementById('addStage');
        this.stagesList = document.getElementById('stagesList');
        this.stageSound = document.getElementById('stageSound');
        this.endSound = document.getElementById('endSound');
        
        this.stages = [];
        this.currentStageIndex = 0;
        this.timeLeft = 0;
        this.totalTime = 0;
        this.elapsedTime = 0;
        this.timerId = null;
        this.isRunning = false;

        this.initializeEventListeners();
        this.loadStagesFromDOM();
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.addStageBtn.addEventListener('click', () => this.addNewStage());
        
        // Event delegation for stage removal and input changes
        this.stagesList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-stage')) {
                const stage = e.target.closest('.stage');
                if (this.stagesList.children.length > 1) {
                    stage.remove();
                    this.loadStagesFromDOM();
                }
            }
        });

        this.stagesList.addEventListener('input', () => {
            if (!this.isRunning) {
                this.loadStagesFromDOM();
            }
        });
    }

    loadStagesFromDOM() {
        this.stages = [];
        this.stagesList.querySelectorAll('.stage').forEach(stageElement => {
            const titleInput = stageElement.querySelector('.stage-title');
            const durationInput = stageElement.querySelector('.stage-duration');
            
            this.stages.push({
                name: titleInput.value || 'Meditation',
                duration: parseInt(durationInput.value) * 60 || 60
            });
        });

        this.totalTime = this.stages.reduce((total, stage) => total + stage.duration, 0);
        this.timeLeft = this.stages[0]?.duration || 0;
        this.updateDisplay();
    }

    addNewStage() {
        const stageElement = document.createElement('div');
        stageElement.className = 'stage';
        stageElement.innerHTML = `
            <input type="text" class="stage-title" value="New Stage" placeholder="Stage name">
            <input type="number" class="stage-duration" min="1" max="60" value="5">
            <span class="minutes-label">min</span>
            <button class="remove-stage">×</button>
        `;
        this.stagesList.appendChild(stageElement);
        this.loadStagesFromDOM();
    }

    toggleTimer() {
        if (!this.isRunning) {
            if (this.timeLeft === 0) {
                this.currentStageIndex = 0;
                this.timeLeft = this.stages[0].duration;
                this.elapsedTime = 0;
            }
            this.startTimer();
        } else {
            this.pauseTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        this.startBtn.textContent = 'Pause';
        this.stagesList.querySelectorAll('input').forEach(input => input.disabled = true);

        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.elapsedTime++;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                if (this.currentStageIndex < this.stages.length - 1) {
                    this.stageSound.play();
                    this.currentStageIndex++;
                    this.timeLeft = this.stages[this.currentStageIndex].duration;
                    this.updateDisplay();
                } else {
                    this.endTimer();
                }
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        clearInterval(this.timerId);
    }

    resetTimer() {
        this.pauseTimer();
        this.currentStageIndex = 0;
        this.timeLeft = this.stages[0]?.duration || 0;
        this.elapsedTime = 0;
        this.stagesList.querySelectorAll('input').forEach(input => input.disabled = false);
        this.updateDisplay();
    }

    endTimer() {
        this.pauseTimer();
        this.endSound.play();
        this.stagesList.querySelectorAll('input').forEach(input => input.disabled = false);
        this.stageNameDisplay.textContent = 'Session Complete';
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (this.stages[this.currentStageIndex]) {
            this.stageNameDisplay.textContent = this.stages[this.currentStageIndex].name;
        }

        // Update progress bar
        const progress = (this.elapsedTime / this.totalTime) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MeditationTimer();
});

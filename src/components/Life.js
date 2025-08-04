import { useState, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';

export default function WeeksOfLife() {
  const [step, setStep] = useState(1);
  const [birthdate, setBirthdate] = useState(() => localStorage.getItem('birthdate') || '');
  const [stats, setStats] = useState(null);
  const [hoverWeek, setHoverWeek] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentFact, setCurrentFact] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('isDarkMode') === 'true');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Format large numbers with commas
  const getFormattedNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };
  
  // Interesting facts function
  const getInterestingFacts = useCallback(() => {
    const basicFacts = [
      "The average person will spend 25 years asleep in their lifetime",
      "You blink about 17,000 times per day",
      "Your heart will beat about 2.5 billion times in your lifetime",
      "The atoms in your body are mostly empty space - you're 99.999% nothing",
      "The average person walks 7,500 miles per year",
      "You experience about 12 full moons each year",
      "The light from distant stars you see at night started its journey before you were born",
      "Every 7 years, your body replaces most of its cells",
      "You share 99.9% of your DNA with every other human on Earth",
      "Your brain uses 20% of your body's total energy despite being only 2% of your weight",
      "Your fingerprints are completely unique",
      "You shed about 30,000 dead skin cells every minute",
      "Your sense of smell can distinguish between 1 trillion different scents",
      "The human eye can distinguish about 10 million colors",
      "Your body produces about 25 million new cells every second"
    ];

    if (!stats) {
      return basicFacts;
    }

    const personalizedFacts = [
      "The average person will spend 25 years asleep in their lifetime",
      "You have blinked approximately " + getFormattedNumber(Math.floor(stats.daysLived * 17280)) + " times since birth",
      "Your heart will beat about 2.5 billion times in your lifetime",
      "The atoms in your body are mostly empty space - you are 99.999% nothing",
      "You have walked approximately " + getFormattedNumber(Math.floor(stats.daysLived * 7500 / 365)) + " miles in your lifetime",
      "You have witnessed " + Math.floor(stats.daysLived / 29.5) + " full moon cycles",
      "The light from distant stars you see at night started its journey before you were born",
      "Every 7 years, your body replaces most of its cells - you are literally a different person",
      "Your hair has grown approximately " + Math.floor(stats.daysLived * 0.44) + " inches since birth",
      "You share 99.9% of your DNA with every other human on Earth",
      "You have consumed roughly " + getFormattedNumber(Math.floor(stats.daysLived * 2)) + " liters of water",
      "You have said approximately " + getFormattedNumber(Math.floor(stats.daysLived * 16000)) + " words",
      "You have laughed roughly " + getFormattedNumber(Math.floor(stats.daysLived * 17)) + " times",
      "You have taken approximately " + getFormattedNumber(Math.floor(stats.daysLived * 20000)) + " steps",
      "You have dreamed for roughly " + getFormattedNumber(Math.floor(stats.hoursSlept * 0.25)) + " hours"
    ];

    return personalizedFacts;
  }, [stats]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('isDarkMode', newValue.toString());
      return newValue;
    });
  };

  // Handle mouse move for tooltip
  const handleMouseMove = (e, weekNumber) => {
    setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 10 });
    setHoverWeek(weekNumber);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setHoverWeek(null);
  };

  // Rotate through interesting facts
  useEffect(() => {
    if (step === 2 && stats) {
      const facts = getInterestingFacts();
      setCurrentFact(facts[0]);
      const factInterval = setInterval(() => {
        setCurrentFact(facts[Math.floor(Math.random() * facts.length)]);
      }, 6000);
      return () => clearInterval(factInterval);
    }
  }, [step, stats, getInterestingFacts]);

  // Save birthdate to localStorage
  useEffect(() => {
    if (birthdate) {
      localStorage.setItem('birthdate', birthdate);
    }
  }, [birthdate]);

  // Auto-load stats if birthdate exists in localStorage
  useEffect(() => {
    const savedBirthdate = localStorage.getItem('birthdate');
    if (savedBirthdate && !stats && step === 1) {
      setBirthdate(savedBirthdate);
      setStats(calculateStats(savedBirthdate));
      setStep(2);
    }
  }, [stats, step]);

  const calculateStats = (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    
    // Time calculations
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const msInDay = 1000 * 60 * 60 * 24;
    const msInYear = 1000 * 60 * 60 * 24 * 365.25;
    
    const weeksLived = Math.floor((today - birthDate) / msInWeek);
    const earthOrbits = (today - birthDate) / msInYear;
    const currentAge = earthOrbits;
    
    // Dynamic total weeks based on current age or 90 years max
    const maxAge = Math.max(90, Math.ceil(currentAge) + 10);
    const totalWeeks = maxAge * 52;
    const weeksRemaining = Math.max(0, totalWeeks - weeksLived);
    const percentageLived = Math.min(100, Math.round((weeksLived / totalWeeks) * 100));
    
    // Detailed time stats
    const daysLived = Math.floor((today - birthDate) / msInDay);
    const hoursLived = daysLived * 24;
    const minutesLived = hoursLived * 60;
    const secondsLived = minutesLived * 60;
    
    // Biological stats
    const heartbeats = Math.floor(daysLived * 24 * 60 * 70);
    const breaths = Math.floor(daysLived * 24 * 60 * 16);
    const hoursSlept = Math.floor(daysLived * 8);
    const blinks = Math.floor(daysLived * 17280);
    
    // Environmental stats
    const seasons = Math.floor(daysLived / 91.25);
    const fullMoons = Math.floor(daysLived / 29.5);
    
    // Cosmic stats
    const earthTravelDistance = Math.round(daysLived * 2.6 * 1000000);
    const solarSystemTravel = Math.round(daysLived * 24 * 828000);
    
    // Social & Cultural stats
    const averageWords = Math.floor(daysLived * 16000);
    const averageSteps = Math.floor(daysLived * 7500);
    const averageMeals = Math.floor(daysLived * 3);
    const averageSmiles = Math.floor(daysLived * 20);
    const moviesWatched = Math.floor(daysLived * 0.33);
    const songsHeard = Math.floor(daysLived * 25);
    
    // Learning & Development stats
    const booksCouldRead = Math.floor(daysLived / 7);
    const skillHoursAvailable = Math.floor(daysLived * 2);
    const languagesCouldLearn = Math.floor(currentAge / 2);
    const degreeEquivalent = Math.floor(skillHoursAvailable / 1440);
    
    // Technology & Modern Life stats
    const internetHours = Math.floor(daysLived * 6.5);
    const phoneChecks = Math.floor(daysLived * 96);
    const emailsSent = Math.floor(daysLived * 12);
    const photosCouldTake = Math.floor(daysLived * 50);
    
    // Health & Wellness stats
    const waterDrunk = Math.floor(daysLived * 2.2);
    const caloriesConsumed = Math.floor(daysLived * 2000);
    const hairGrowth = Math.floor(daysLived * 0.35);
    const fingernailGrowth = Math.floor(daysLived * 0.1);
    
    // Creative & Personal stats
    const memoriesFormed = Math.floor(daysLived * 50);
    const dreamsHad = Math.floor((hoursSlept / 8) * 4);
    const laughs = Math.floor(daysLived * 17);
    const conversations = Math.floor(daysLived * 7);
    
    return {
      weeksLived,
      totalWeeks,
      weeksRemaining,
      percentageLived,
      maxAge,
      daysLived,
      hoursLived,
      minutesLived,
      secondsLived,
      heartbeats,
      breaths,
      hoursSlept,
      blinks,
      seasons,
      fullMoons,
      earthOrbits: earthOrbits.toFixed(2),
      earthTravelDistance,
      solarSystemTravel,
      birthYear,
      birthMonth,
      age: earthOrbits.toFixed(1),
      averageWords,
      averageSteps,
      averageMeals,
      averageSmiles,
      moviesWatched,
      songsHeard,
      booksCouldRead,
      skillHoursAvailable,
      languagesCouldLearn,
      degreeEquivalent,
      internetHours,
      phoneChecks,
      emailsSent,
      photosCouldTake,
      waterDrunk,
      caloriesConsumed,
      hairGrowth,
      fingernailGrowth,
      memoriesFormed,
      dreamsHad,
      laughs,
      conversations
    };
  };

  // Share functionality
  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Hide tooltips and temporarily disable hover effects
      setShowTooltip(false);
      
      // Create share layout dynamically
      const shareLayout = createShareLayout();
      document.body.appendChild(shareLayout);
      
      // Wait a bit for rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      // Determine canvas dimensions based on device
      const isMobile = window.innerWidth < 768;
      const canvasWidth = isMobile ? 800 : 1200;
      const canvasHeight = isMobile ? 1000 : 800;

      // Generate the image
      const canvas = await html2canvas(shareLayout, {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        width: canvasWidth,
        height: canvasHeight,
      });

      // Remove the temporary element
      document.body.removeChild(shareLayout);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `my-life-in-weeks-${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
      
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Sorry, there was an error generating your image. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  // Create optimized share layout
  const createShareLayout = () => {
    const container = document.createElement('div');
    const isMobile = window.innerWidth < 768;
    const containerWidth = isMobile ? 800 : 1200;
    const containerHeight = isMobile ? 1000 : 800;
    
    container.style.cssText = `
      position: fixed;
      top: -10000px;
      left: -10000px;
      width: ${containerWidth}px;
      height: ${containerHeight}px;
      padding: ${isMobile ? '20px 20px 40px 20px' : '30px 30px 50px 30px'};
      background: ${isDarkMode ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'};
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
      color: ${isDarkMode ? '#ffffff' : '#1f2937'};
      box-sizing: border-box;
      overflow: hidden;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      text-align: center;
      margin-bottom: ${isMobile ? '15px' : '20px'};
    `;
    header.innerHTML = `
      <h1 style="font-size: ${isMobile ? '24px' : '28px'}; font-weight: bold; margin: 0 0 6px 0; color: ${isDarkMode ? '#ffffff' : '#1f2937'};">Life Visualizer</h1>
      <p style="font-size: ${isMobile ? '12px' : '14px'}; margin: 0; color: ${isDarkMode ? '#d1d5db' : '#6b7280'};">${stats.age} years old • ${stats.percentageLived}% lived • ${getFormattedNumber(stats.weeksRemaining)} weeks remaining</p>
    `;

    // Main content - responsive layout
    const mainContent = document.createElement('div');
    mainContent.style.cssText = `
      display: flex;
      flex-direction: ${isMobile ? 'column' : 'row'};
      gap: ${isMobile ? '15px' : '20px'};
      height: calc(100% - ${isMobile ? '70px' : '90px'});
      align-items: stretch;
    `;

    // Left side - Week grid
    const leftSide = document.createElement('div');
    leftSide.style.cssText = `
      flex: ${isMobile ? '0 0 auto' : '0 0 350px'};
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    `;

    // Week grid container - responsive sizing
    const weekGridContainer = document.createElement('div');
    weekGridContainer.style.cssText = `
      background: ${isDarkMode ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.9)'};
      border-radius: 12px;
      padding: ${isMobile ? '12px' : '16px'};
      border: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
      box-shadow: 0 8px 20px ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
      ${isMobile ? 'height: auto;' : 'height: 100%;'}
      display: flex;
      flex-direction: column;
    `;

    // Create responsive week grid
    const weeksPerRow = 52;
    const totalRows = Math.min(Math.ceil(stats.totalWeeks / weeksPerRow), 90);
    const cellSize = isMobile ? '2.5px' : '3.5px';
    const cellMargin = isMobile ? '0.3px' : '0.5px';
    let weekGridHTML = '';
    
    for (let row = 0; row < totalRows; row++) {
      weekGridHTML += '<div style="display: flex; justify-content: center; margin-bottom: 1px;">';
      for (let col = 0; col < weeksPerRow; col++) {
        const weekNumber = row * weeksPerRow + col;
        if (weekNumber >= stats.totalWeeks) break;
        
        const isPast = weekNumber < stats.weeksLived;
        const isCurrent = weekNumber === stats.weeksLived;
        
        let bgColor;
        if (isPast) {
          bgColor = isDarkMode ? '#6366f1' : '#4f46e5';
        } else if (isCurrent) {
          bgColor = '#fbbf24';
        } else {
          bgColor = isDarkMode ? '#4b5563' : '#e5e7eb';
        }
        
        weekGridHTML += `<div style="width: ${cellSize}; height: ${cellSize}; margin: ${cellMargin}; border-radius: 0.5px; background-color: ${bgColor};"></div>`;
      }
      weekGridHTML += '</div>';
    }

    weekGridContainer.innerHTML = `
      <h3 style="font-size: ${isMobile ? '14px' : '16px'}; font-weight: bold; margin: 0 0 ${isMobile ? '8px' : '12px'} 0; text-align: center; color: ${isDarkMode ? '#ffffff' : '#1f2937'};">Life Visualization</h3>
      <div style="margin-bottom: ${isMobile ? '8px' : '12px'}; flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">${weekGridHTML}</div>
      <div style="display: flex; justify-content: center; gap: ${isMobile ? '8px' : '12px'}; font-size: ${isMobile ? '8px' : '10px'};">
        <div style="display: flex; align-items: center;">
          <div style="width: 6px; height: 6px; background-color: ${isDarkMode ? '#6366f1' : '#4f46e5'}; border-radius: 1px; margin-right: ${isMobile ? '3px' : '4px'};"></div>
          <span style="color: ${isDarkMode ? '#d1d5db' : '#6b7280'};">Past</span>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="width: 6px; height: 6px; background-color: #fbbf24; border-radius: 1px; margin-right: ${isMobile ? '3px' : '4px'};"></div>
          <span style="color: ${isDarkMode ? '#d1d5db' : '#6b7280'};">Now</span>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="width: 6px; height: 6px; background-color: ${isDarkMode ? '#4b5563' : '#e5e7eb'}; border-radius: 1px; margin-right: ${isMobile ? '3px' : '4px'};"></div>
          <span style="color: ${isDarkMode ? '#d1d5db' : '#6b7280'};">Future</span>
        </div>
      </div>
    `;

    leftSide.appendChild(weekGridContainer);

    // Right side - Stats grid (responsive)
    const rightSide = document.createElement('div');
    const gridCols = isMobile ? 3 : 4;
    const gridRows = isMobile ? 6 : 4;
    rightSide.style.cssText = `
      flex: 1;
      display: grid;
      grid-template-columns: repeat(${gridCols}, 1fr);
      grid-template-rows: repeat(${gridRows}, 1fr);
      gap: ${isMobile ? '6px' : '8px'};
      min-height: 0;
    `;

    // Comprehensive stats - adjusted for mobile
    const keyStats = [
      { icon: '⏳', title: 'Days Lived', value: getFormattedNumber(stats.daysLived), unit: '' },
      { icon: '💓', title: 'Heartbeats', value: (stats.heartbeats / 1000000).toFixed(0) + 'M', unit: '' },
      { icon: '🫁', title: 'Breaths', value: (stats.breaths / 1000000).toFixed(0) + 'M', unit: '' },
      { icon: '👁️', title: 'Blinks', value: (stats.blinks / 1000000).toFixed(0) + 'M', unit: '' },
      { icon: '🌍', title: 'Earth Orbits', value: stats.earthOrbits, unit: '' },
      { icon: '🌙', title: 'Full Moons', value: stats.fullMoons, unit: '' },
      { icon: '🗓️', title: 'Seasons', value: stats.seasons, unit: '' },
      { icon: '😴', title: 'Sleep Years', value: Math.round(stats.hoursSlept/24/365), unit: '' },
      { icon: '👥', title: 'Words Spoken', value: (stats.averageWords / 1000000).toFixed(0) + 'M', unit: '' },
      { icon: '🚶', title: 'Steps Taken', value: (stats.averageSteps / 1000000).toFixed(0) + 'M', unit: '' },
      { icon: '🍽️', title: 'Meals Eaten', value: getFormattedNumber(stats.averageMeals), unit: '' },
      { icon: '😊', title: 'Times Smiled', value: getFormattedNumber(stats.averageSmiles), unit: '' },
      { icon: '📚', title: 'Books Possible', value: getFormattedNumber(stats.booksCouldRead), unit: '' },
      { icon: '🎓', title: 'Degrees Possible', value: stats.degreeEquivalent, unit: '' },
      { icon: '🌐', title: 'Internet Hours', value: getFormattedNumber(stats.internetHours), unit: '' },
      { icon: '✨', title: 'Weeks Left', value: getFormattedNumber(stats.weeksRemaining), unit: '' }
    ];

    // Take first 12 or 16 stats based on layout
    const statsToShow = keyStats.slice(0, gridCols * gridRows);

    statsToShow.forEach(stat => {
      const statCard = document.createElement('div');
      statCard.style.cssText = `
        background: ${isDarkMode ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.9)'};
        border-radius: 6px;
        padding: ${isMobile ? '6px' : '8px'};
        text-align: center;
        border: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
        box-shadow: 0 2px 4px ${isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 0;
      `;
      statCard.innerHTML = `
        <div style="font-size: ${isMobile ? '14px' : '18px'}; margin-bottom: ${isMobile ? '2px' : '4px'};">${stat.icon}</div>
        <div style="font-size: ${isMobile ? '11px' : '14px'}; font-weight: bold; margin-bottom: 2px; color: ${isDarkMode ? '#ffffff' : '#1f2937'}; line-height: 1.1;">${stat.value}</div>
        ${stat.unit ? `<div style="font-size: ${isMobile ? '7px' : '9px'}; color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; margin-bottom: 2px;">${stat.unit}</div>` : ''}
        <div style="font-size: ${isMobile ? '7px' : '9px'}; color: ${isDarkMode ? '#d1d5db' : '#4b5563'}; line-height: 1.0;">${stat.title}</div>
      `;
      rightSide.appendChild(statCard);
    });

    // Assemble layout
    mainContent.appendChild(leftSide);
    mainContent.appendChild(rightSide);
    
    // Footer with GitHub info
    const footer = document.createElement('div');
    footer.style.cssText = `
      position: absolute;
      bottom: ${isMobile ? '8px' : '10px'};
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      font-size: ${isMobile ? '9px' : '11px'};
      color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
    `;
    footer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: ${isMobile ? '6px' : '8px'};">
        <span>⭐ github.com/Meykaye/Life-Visualizer</span>
        <span>•</span>
        <span>Built with ❤️ by @Meykaye</span>
      </div>
    `;
    
    container.appendChild(header);
    container.appendChild(mainContent);
    container.appendChild(footer);

    return container;
  };

  const handleSubmit = () => {
    if (!birthdate) return;
    
    setIsAnimating(true);
    setAnimationProgress(0);
    setStats(calculateStats(birthdate));
    
    const duration = 2000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setStep(2);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const renderWeekGrid = () => {
    if (!stats) return null;
    
    const weeksPerRow = 52;
    const totalRows = Math.ceil(stats.totalWeeks / weeksPerRow);
    
    return (
      <div className={`mt-8 p-3 sm:p-6 rounded-2xl shadow-lg border ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <h2 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-0 text-center sm:text-left ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Your Life in Weeks
          </h2>
          <div className={`text-sm sm:text-lg text-center sm:text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <span className="font-semibold">{stats.age} years</span> • 
            <span className={`font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}> {stats.percentageLived}%</span> lived
          </div>
        </div>
        
        <div className="flex justify-center overflow-x-auto">
          <div className="inline-block min-w-0">
            {Array.from({ length: totalRows }).map((_, row) => (
              <div key={row} className="flex justify-center mb-0.5 sm:mb-1">
                {Array.from({ length: weeksPerRow }).map((_, col) => {
                  const weekNumber = row * weeksPerRow + col;
                  if (weekNumber >= stats.totalWeeks) return null;
                  
                  const isPast = weekNumber < stats.weeksLived;
                  const isCurrent = weekNumber === stats.weeksLived;
                  
                  let cellClass = "w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 m-0.5 rounded-sm transition-all duration-100 cursor-pointer ";
                  if (isPast) {
                    cellClass += isDarkMode 
                      ? "bg-indigo-500 hover:bg-indigo-400 " 
                      : "bg-indigo-600 hover:bg-indigo-700 ";
                  } else if (isCurrent) {
                    cellClass += "bg-yellow-400 shadow-md shadow-yellow-400/50 animate-pulse ";
                  } else {
                    cellClass += isDarkMode 
                      ? "bg-gray-600 hover:bg-gray-500 " 
                      : "bg-gray-100 hover:bg-gray-200 ";
                  }
                  
                  if (isAnimating && weekNumber < stats.weeksLived * animationProgress) {
                    cellClass += "animate-pulse ";
                  }
                  
                  return (
                    <div 
                      key={weekNumber}
                      className={cellClass}
                      onMouseMove={(e) => handleMouseMove(e, weekNumber)}
                      onMouseLeave={handleMouseLeave}
                      title={`Week ${weekNumber + 1}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 text-xs sm:text-sm">
          <div className="flex items-center">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm mr-1 sm:mr-2 ${
              isDarkMode ? 'bg-indigo-500' : 'bg-indigo-600'
            }`}></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Past</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-sm mr-1 sm:mr-2"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Present</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm mr-1 sm:mr-2 ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
            }`}></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Future</span>
          </div>
        </div>
      </div>
    );
  };

  const StatCard = ({ title, icon, children }) => (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-md border hover:shadow-lg transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="text-xl sm:text-2xl mr-2 sm:mr-3">{icon}</div>
        <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h3>
      </div>
      <div className={`space-y-3 sm:space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {children}
      </div>
    </div>
  );

  const StatItem = ({ label, value, unit }) => (
    <div className="flex justify-between items-baseline gap-2">
      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm leading-tight`}>{label}</span>
      <span className={`font-semibold text-sm sm:text-base text-right ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {value} {unit && <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{unit}</span>}
      </span>
    </div>
  );

  const renderStats = () => {
    if (!stats) return null;
    
    return (
      <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        <StatCard title="Time Perspective" icon="⏳">
          <StatItem label="Weeks lived" value={getFormattedNumber(stats.weeksLived)} unit={`/${getFormattedNumber(stats.totalWeeks)}`} />
          <StatItem label="Days lived" value={getFormattedNumber(stats.daysLived)} />
          <StatItem label="Hours lived" value={getFormattedNumber(stats.hoursLived)} />
          <StatItem label="Minutes lived" value={getFormattedNumber(stats.minutesLived)} />
          <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You have completed {stats.percentageLived}% of a {stats.maxAge}-year lifespan. That is {getFormattedNumber(stats.weeksRemaining)} weeks remaining.
            </p>
          </div>
        </StatCard>

        <StatCard title="Biological Experience" icon="🧬">
          <StatItem label="Heartbeats" value={getFormattedNumber(stats.heartbeats)} />
          <StatItem label="Breaths taken" value={getFormattedNumber(stats.breaths)} />
          <StatItem label="Hours slept" value={getFormattedNumber(stats.hoursSlept)} unit={`(${Math.round(stats.hoursSlept/24/365)} years)`} />
          <StatItem label="Blinks" value={getFormattedNumber(stats.blinks)} />
          <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your cells regenerate constantly - you are made of entirely new atoms since childhood.
            </p>
          </div>
        </StatCard>

        <StatCard title="Earth's Rhythm" icon="🌎">
          <StatItem label="Trips around the sun" value={stats.earthOrbits} />
          <StatItem label="Seasons experienced" value={stats.seasons} />
          <StatItem label="Full moons witnessed" value={stats.fullMoons} />
          <StatItem label="Distance traveled (Earth orbit)" value={getFormattedNumber(stats.earthTravelDistance)} unit="km" />
          <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              While standing still, you're moving at 107,000 km/h around the galaxy.
            </p>
          </div>
        </StatCard>

        <StatCard title="Cosmic Perspective" icon="🌌">
          <StatItem label="Solar system movement" value={getFormattedNumber(stats.solarSystemTravel)} unit="km" />
          <StatItem label="Percentage of universe age" value={(80/13800000000 * 100).toFixed(10)} unit="%" />
          <StatItem label="Stardust in you" value="~93%" unit="of atoms" />
          <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              The iron in your blood was forged in supernovae billions of years ago.
            </p>
          </div>
        </StatCard>

        <StatCard title="Social & Cultural Experience" icon="👥">
          <StatItem label="Words spoken" value={getFormattedNumber(stats.averageWords)} />
          <StatItem label="Steps taken" value={getFormattedNumber(stats.averageSteps)} />
          <StatItem label="Meals enjoyed" value={getFormattedNumber(stats.averageMeals)} />
          <StatItem label="Times smiled" value={getFormattedNumber(stats.averageSmiles)} />
          <StatItem label="Movies watched" value={getFormattedNumber(stats.moviesWatched)} unit="(estimated)" />
          <StatItem label="Songs heard" value={getFormattedNumber(stats.songsHeard)} />
          <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Every interaction shapes who you are - you have had roughly {getFormattedNumber(stats.conversations)} meaningful conversations.
            </p>
          </div>
        </StatCard>

        <StatCard title="Learning & Growth" icon="📚">
          <StatItem label="Books you could have read" value={getFormattedNumber(stats.booksCouldRead)} unit="(1/week)" />
          <StatItem label="Skill development hours" value={getFormattedNumber(stats.skillHoursAvailable)} />
          <StatItem label="Languages you could master" value={stats.languagesCouldLearn} unit="(2 years each)" />
          <StatItem label="University degrees equivalent" value={stats.degreeEquivalent} unit="(1,440 hrs each)" />
          <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              With just 1 hour daily, you could become an expert in any field within 3-5 years.
            </p>
          </div>
        </StatCard>

        <StatCard title="Digital Life" icon="📱">
          <StatItem label="Internet hours" value={getFormattedNumber(stats.internetHours)} />
          <StatItem label="Phone checks" value={getFormattedNumber(stats.phoneChecks)} />
          <StatItem label="Emails sent" value={getFormattedNumber(stats.emailsSent)} unit="(estimated)" />
          <StatItem label="Photos you could take" value={getFormattedNumber(stats.photosCouldTake)} />
          <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You are part of the first generation to live largely digital lives - what a time to be alive!
            </p>
          </div>
        </StatCard>

        <StatCard title="Health & Wellness" icon="💪">
          <StatItem label="Water consumed" value={getFormattedNumber(stats.waterDrunk)} unit="liters" />
          <StatItem label="Calories consumed" value={getFormattedNumber(stats.caloriesConsumed)} />
          <StatItem label="Hair grown" value={getFormattedNumber(stats.hairGrowth)} unit="mm" />
          <StatItem label="Fingernail growth" value={getFormattedNumber(stats.fingernailGrowth)} unit="mm" />
          <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your body is constantly renewing itself - you are literally not the same person you were 7 years ago.
            </p>
          </div>
        </StatCard>

        <StatCard title="Memories & Experiences" icon="🧠">
          <StatItem label="Memories formed" value={getFormattedNumber(stats.memoriesFormed)} unit="(estimated)" />
          <StatItem label="Dreams experienced" value={getFormattedNumber(stats.dreamsHad)} />
          <StatItem label="Times laughed" value={getFormattedNumber(stats.laughs)} />
          <StatItem label="Conversations had" value={getFormattedNumber(stats.conversations)} />
          <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your brain stores about 2.5 petabytes of information - equivalent to 3 million hours of TV shows.
            </p>
          </div>
        </StatCard>

        <div className={`p-4 sm:p-6 rounded-2xl border ${
          isDarkMode 
            ? 'bg-indigo-900/30 border-indigo-800' 
            : 'bg-indigo-50 border-indigo-100'
        }`}>
          <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${
            isDarkMode ? 'text-indigo-300' : 'text-indigo-800'
          }`}>
            💡 Fascinating Fact
          </h3>
          <p className={`italic mb-3 sm:mb-4 text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            "{currentFact || getInterestingFacts()[0]}"
          </p>
          <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            <p>Each week is a unique, non-renewable resource.</p>
            <p className="mt-1 sm:mt-2">How will you use your remaining {getFormattedNumber(stats.weeksRemaining)} weeks?</p>
          </div>
        </div>
      </div>
    );
  };

  const handleReset = () => {
    setBirthdate('');
    setStats(null);
    setStep(1);
    setCurrentFact('');
    localStorage.removeItem('birthdate');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 p-2 sm:p-4 pt-6 sm:pt-8 md:pt-12 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 ${
            isDarkMode 
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
              : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          }`}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="text-lg sm:text-xl">{isDarkMode ? '☀️' : '🌙'}</span>
        </button>
      </div>

      {showTooltip && hoverWeek !== null && (
        <div 
          className={`fixed z-50 p-1.5 sm:p-2 rounded-lg shadow-lg text-xs sm:text-sm pointer-events-none transition-opacity duration-200 max-w-xs ${
            isDarkMode 
              ? 'bg-gray-700 text-white border border-gray-600' 
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
          style={{ 
            left: Math.min(tooltipPosition.x, window.innerWidth - 150), 
            top: tooltipPosition.y - 60,
            transform: 'translate(-50%, 0)'
          }}
        >
          <div className="font-semibold">Week {hoverWeek + 1}</div>
          <div className="text-xs">
            {hoverWeek < stats?.weeksLived ? (
              `Age ${Math.floor(hoverWeek/52)} years, ${hoverWeek%52} weeks`
            ) : hoverWeek === stats?.weeksLived ? (
              'Current week'
            ) : (
              `Future age ${Math.floor(hoverWeek/52)} years`
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Life Visualizer
          </h1>
          <p className={`text-base sm:text-lg max-w-lg mx-auto px-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Visualizing the finite nature of time to inspire meaningful living
          </p>
        </div>
        
        {step === 1 ? (
          <div className={`p-4 sm:p-6 md:p-8 rounded-2xl shadow-md border max-w-md mx-auto ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Begin Your Journey
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label 
                  htmlFor="birthdate" 
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Enter your birth date
                </label>
                <input
                  id="birthdate"
                  type="date"
                  className={`w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <button
                onClick={handleSubmit}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium text-base sm:text-lg transition-all ${
                  birthdate 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
                disabled={!birthdate}
              >
                Visualize My Time ✨
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="share-container">
              {renderWeekGrid()}
              {renderStats()}
            </div>
            
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={handleShare}
                disabled={isSharing}
                className={`px-4 sm:px-6 py-2 border rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base ${
                  isDarkMode 
                    ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 disabled:bg-indigo-400' 
                    : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 disabled:bg-indigo-400'
                }`}
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    📤 Share My Life Map
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className={`px-4 sm:px-6 py-2 border rounded-lg transition-colors shadow-sm text-sm sm:text-base ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                🔄 Start Over
              </button>
            </div>
            
            <div className={`mt-8 sm:mt-12 text-center text-xs sm:text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <p>Each square represents one week of your projected lifespan</p>
              <p className="mt-1 sm:mt-2">This moment will never come again - how will you honor it? 🌟</p>
            </div>

            {/* GitHub Star Section */}
            <div className={`mt-6 sm:mt-8 py-4 sm:py-6 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="text-center">
                <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Found this helpful? Give it a star! ⭐
                </p>
                <a
                  href="https://github.com/Meykaye/Life-Visualizer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 text-sm ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Star on GitHub</span>
                  <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                    isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Free & Open Source
                  </span>
                </a>
                <p className={`text-xs mt-2 sm:mt-3 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Built with ❤️ by{' '}
                  <a 
                    href="https://github.com/Meykaye" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`hover:underline ${
                      isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`}
                  >
                    @Meykaye
                  </a>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
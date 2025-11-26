const { format, parseISO, differenceInDays } = require('date-fns');

/**
 * Timeline Generator - Creates and analyzes case timelines
 * Provides clear visualization and insights in plain English
 */
class TimelineGenerator {
  constructor() {
    this.eventTypes = {
      incident: '🔴',
      filing: '📄',
      hearing: '⚖️',
      discovery: '🔍',
      motion: '📝',
      settlement: '🤝',
      verdict: '⭐',
      general: '📌'
    };
  }

  /**
   * Generate a timeline from case events
   */
  generateTimeline(events) {
    if (!events || events.length === 0) {
      return {
        events: [],
        summary: 'No timeline events available.',
        duration: null
      };
    }

    // Sort events chronologically
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    const firstEvent = sortedEvents[0];
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    const duration = differenceInDays(
      new Date(lastEvent.date),
      new Date(firstEvent.date)
    );

    return {
      events: sortedEvents,
      summary: this.generateTimelineSummary(sortedEvents, duration),
      duration,
      startDate: firstEvent.date,
      endDate: lastEvent.date,
      milestones: this.identifyMilestones(sortedEvents)
    };
  }

  /**
   * Generate timeline summary in plain English
   */
  generateTimelineSummary(events, duration) {
    if (events.length === 0) {
      return 'No events in timeline.';
    }

    const firstDate = format(new Date(events[0].date), 'MMMM d, yyyy');
    const lastDate = format(new Date(events[events.length - 1].date), 'MMMM d, yyyy');
    
    const typeCount = {};
    events.forEach(e => {
      const type = e.type || 'general';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const typeSummary = Object.entries(typeCount)
      .map(([type, count]) => `${count} ${type}`)
      .join(', ');

    return `Timeline spans ${duration} days from ${firstDate} to ${lastDate}. Contains ${events.length} events: ${typeSummary}.`;
  }

  /**
   * Identify key milestones in the timeline
   */
  identifyMilestones(events) {
    const milestones = [];
    const importantTypes = ['filing', 'hearing', 'verdict', 'settlement'];

    events.forEach(event => {
      if (importantTypes.includes(event.type) || event.importance === 'high') {
        milestones.push({
          ...event,
          reason: this.getMilestoneReason(event)
        });
      }
    });

    return milestones;
  }

  /**
   * Get reason why an event is a milestone
   */
  getMilestoneReason(event) {
    const reasons = {
      filing: 'Initial case filing - marks the beginning of legal proceedings',
      hearing: 'Court hearing - important procedural event',
      verdict: 'Verdict rendered - case outcome determined',
      settlement: 'Settlement reached - case resolved',
      motion: 'Legal motion filed - may affect case direction'
    };

    if (event.importance === 'high') {
      return 'Marked as high importance event';
    }

    return reasons[event.type] || 'Significant event in case progression';
  }

  /**
   * Format timeline for display
   */
  formatTimeline(timeline, options = {}) {
    const { includeDescriptions = true, groupBy = null } = options;

    if (!timeline.events || timeline.events.length === 0) {
      return 'No events to display.';
    }

    let output = '📅 Case Timeline\n';
    output += '═══════════════════════════════════════════\n\n';

    if (timeline.summary) {
      output += `${timeline.summary}\n\n`;
    }

    if (timeline.milestones && timeline.milestones.length > 0) {
      output += `🌟 ${timeline.milestones.length} Key Milestones Identified\n\n`;
    }

    output += 'Events:\n';
    output += '───────────────────────────────────────────\n\n';

    if (groupBy === 'month') {
      output += this.formatByMonth(timeline.events, includeDescriptions);
    } else if (groupBy === 'type') {
      output += this.formatByType(timeline.events, includeDescriptions);
    } else {
      output += this.formatChronological(timeline.events, includeDescriptions);
    }

    return output;
  }

  /**
   * Format events chronologically
   */
  formatChronological(events, includeDescriptions) {
    let output = '';
    
    events.forEach((event, index) => {
      const icon = this.eventTypes[event.type] || this.eventTypes.general;
      const date = format(new Date(event.date), 'MMM d, yyyy');
      const importance = event.importance === 'high' ? ' ⭐' : '';
      
      output += `${icon} ${date}${importance}\n`;
      output += `   ${event.title}\n`;
      
      if (includeDescriptions && event.description) {
        const desc = event.description.length > 100 
          ? event.description.substring(0, 100) + '...'
          : event.description;
        output += `   ${desc}\n`;
      }
      
      if (event.relatedEvidence && event.relatedEvidence.length > 0) {
        output += `   🔗 Related to ${event.relatedEvidence.length} evidence item(s)\n`;
      }
      
      output += '\n';
    });

    return output;
  }

  /**
   * Format events grouped by month
   */
  formatByMonth(events, includeDescriptions) {
    let output = '';
    const byMonth = {};

    events.forEach(event => {
      const monthKey = format(new Date(event.date), 'yyyy-MM');
      if (!byMonth[monthKey]) {
        byMonth[monthKey] = [];
      }
      byMonth[monthKey].push(event);
    });

    Object.keys(byMonth).sort().forEach(monthKey => {
      const monthLabel = format(parseISO(monthKey + '-01'), 'MMMM yyyy');
      output += `\n📆 ${monthLabel}\n`;
      output += '   ' + '─'.repeat(monthLabel.length + 2) + '\n';
      
      byMonth[monthKey].forEach(event => {
        const icon = this.eventTypes[event.type] || this.eventTypes.general;
        const day = format(new Date(event.date), 'd');
        output += `   ${icon} Day ${day}: ${event.title}\n`;
        
        if (includeDescriptions && event.description) {
          const desc = event.description.length > 80 
            ? event.description.substring(0, 80) + '...'
            : event.description;
          output += `      ${desc}\n`;
        }
      });
      output += '\n';
    });

    return output;
  }

  /**
   * Format events grouped by type
   */
  formatByType(events, includeDescriptions) {
    let output = '';
    const byType = {};

    events.forEach(event => {
      const type = event.type || 'general';
      if (!byType[type]) {
        byType[type] = [];
      }
      byType[type].push(event);
    });

    Object.keys(byType).sort().forEach(type => {
      const icon = this.eventTypes[type] || this.eventTypes.general;
      const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
      
      output += `\n${icon} ${typeLabel} (${byType[type].length})\n`;
      output += '   ' + '─'.repeat(typeLabel.length + 5) + '\n';
      
      byType[type]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(event => {
          const date = format(new Date(event.date), 'MMM d, yyyy');
          output += `   ${date}: ${event.title}\n`;
          
          if (includeDescriptions && event.description) {
            const desc = event.description.length > 80 
              ? event.description.substring(0, 80) + '...'
              : event.description;
            output += `      ${desc}\n`;
          }
        });
      output += '\n';
    });

    return output;
  }

  /**
   * Analyze gaps in timeline
   */
  analyzeGaps(events) {
    if (!events || events.length < 2) {
      return {
        gaps: [],
        summary: 'Not enough events to analyze gaps.'
      };
    }

    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    const gaps = [];
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const current = sortedEvents[i];
      const next = sortedEvents[i + 1];
      const daysBetween = differenceInDays(
        new Date(next.date),
        new Date(current.date)
      );

      if (daysBetween > 30) {
        gaps.push({
          startEvent: current.title,
          endEvent: next.title,
          startDate: current.date,
          endDate: next.date,
          days: daysBetween,
          significance: daysBetween > 90 ? 'high' : 'medium'
        });
      }
    }

    let summary = '';
    if (gaps.length === 0) {
      summary = 'No significant gaps detected in timeline.';
    } else {
      summary = `Found ${gaps.length} significant gap(s) in the timeline. `;
      const largestGap = gaps.reduce((max, gap) => 
        gap.days > max.days ? gap : max, gaps[0]
      );
      summary += `Largest gap: ${largestGap.days} days between "${largestGap.startEvent}" and "${largestGap.endEvent}".`;
    }

    return { gaps, summary };
  }

  /**
   * Generate timeline insights in plain English
   */
  generateInsights(timeline) {
    const insights = [];
    
    if (!timeline.events || timeline.events.length === 0) {
      return ['No events available for analysis.'];
    }

    // Duration insight
    if (timeline.duration !== null) {
      if (timeline.duration < 30) {
        insights.push('This is a relatively short timeline, spanning less than a month.');
      } else if (timeline.duration < 180) {
        insights.push('This timeline covers several months, indicating an ongoing case.');
      } else if (timeline.duration < 365) {
        insights.push('This timeline extends for most of a year, suggesting a complex case.');
      } else {
        insights.push(`This timeline spans over ${Math.floor(timeline.duration / 365)} year(s), indicating a long-running case.`);
      }
    }

    // Milestone insight
    if (timeline.milestones && timeline.milestones.length > 0) {
      insights.push(`${timeline.milestones.length} key milestone(s) identified that are crucial to case progression.`);
    }

    // Event density
    const eventDensity = timeline.events.length / (timeline.duration || 1);
    if (eventDensity > 1) {
      insights.push('High event density - multiple events occurring within short timeframes.');
    } else if (eventDensity < 0.1) {
      insights.push('Low event density - events are spread out over time with significant gaps.');
    }

    // Recent activity
    const lastEvent = timeline.events[timeline.events.length - 1];
    const daysSinceLastEvent = differenceInDays(new Date(), new Date(lastEvent.date));
    
    if (daysSinceLastEvent < 7) {
      insights.push('Recent activity detected - case is actively progressing.');
    } else if (daysSinceLastEvent > 90) {
      insights.push('No recent activity - case may be dormant or awaiting developments.');
    }

    return insights;
  }

  /**
   * Create a quick timeline view (simplified)
   */
  quickView(events) {
    if (!events || events.length === 0) {
      return 'No events to display.';
    }

    const sorted = [...events]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10); // Show only first 10

    let output = '⚡ Quick Timeline View\n\n';
    
    sorted.forEach(event => {
      const icon = this.eventTypes[event.type] || '•';
      const date = format(new Date(event.date), 'MMM d, yyyy');
      output += `${icon} ${date} - ${event.title}\n`;
    });

    if (events.length > 10) {
      output += `\n... and ${events.length - 10} more events\n`;
    }

    return output;
  }
}

module.exports = TimelineGenerator;

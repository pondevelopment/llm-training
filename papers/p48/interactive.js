(function() {
  'use strict';
  
  // Framework data from Benbya, Pachidi, Jarvenpaa (JAIS 2021)
  const frameworkData = {
    automation: {
      name: 'Automation',
      description: 'AI-enabled automation using physical robots, RPA, and ML to support structured/semi-structured tasks—both physical (factory robots, autonomous delivery) and cognitive (data entry, anomaly detection). Invokes tensions about how work is performed and who performs it.',
      technologies: ['Physical Robots', 'Robotic Process Automation (RPA)', 'Machine Learning', 'Cognitive Automation'],
      tensions: {
        substitution: {
          name: 'Substitution of Jobs vs Tasks',
          challenge: 'Anxiety about technological unemployment extends from manual to cognitive work. Predictions suggest robots will rise from 10% to 25% of manufacturing tasks by 2025, yet evidence shows most occupations have replaceable tasks but no occupation is fully replaceable. Organizations must manage power reconfigurations as some groups are deskilled (account managers) while others become indispensable (data scientists).',
          opportunity: 'Study how AI integration reshapes organizational structure, power dynamics, and knowledge flows. Investigate visibility effects (physical robots vs background RPA), adoption drivers, human-machine coordination patterns, and emergence of new roles (translators, coordinators). Focus on long-term workforce impacts including deskilling, reskilling pathways, and career adaptation.',
          questions: [
            'What characteristics of AI automation technologies lead to acceptance for automating tasks?',
            'How do humans adjust routines to accommodate physical robots vs invisible RPA tools?',
            'What workarounds do workers develop when RPA tools operate in the background?',
            'How does task automation alter information flows and team dynamics?',
            'What coordinative adaptations emerge as humans collaborate with automation tools?',
            'How do automation tools transform knowledge creation, transformation, and sharing practices?'
          ],
          risk: 'Workforce resistance from inadequate communication about which tasks (not jobs) are automated. Power struggles as automation displaces specific occupational groups while elevating others. Loss of tacit knowledge if automation proceeds without codification. Reduced organizational adaptability if automation renders operations "mindless."',
          governance: 'Establish transparent communication about task-level automation (not job elimination). Create retraining programs for displaced tasks. Implement visibility mechanisms for background automation. Develop coordinative roles (translators, facilitators) for human-robot teams. Maintain human involvement in tasks requiring tacit knowledge.',
          success: 'Tasks automated without occupational elimination. Power reconfigurations managed through transparent communication. New roles emerge to coordinate human-automation collaboration. Knowledge flows adapted to accommodate automation. Workforce maintains adaptability despite automation presence.'
        },
        augmentation: {
          name: 'Automation vs Augmentation',
          challenge: 'Organizations face binary choice: automate (remove humans from loop) vs augment (enhance human capabilities). Automation emphasizes efficiency and cost reduction; augmentation emphasizes human judgment and creativity. Research suggests overemphasizing either creates detrimental performance consequences. Control theories assume alignment with organizational goals, but AI\'s learning capability shifts control from programmers to training data.',
          opportunity: 'Rethink control concepts beyond agency theory when targets (algorithms) are beyond controllability/explainability. Investigate stewardship theories based on trust and shared interests. Study how AI-enabled coordination tools apply to complex nonroutine tasks. Examine impact on employee well-being, knowledge collaboration, and expertise development as junior tasks are automated.',
          questions: [
            'What technological architectures best support full automation vs augmentation?',
            'What criteria should organizations use to decide automation vs augmentation?',
            'How does AI-enabled automation impact organizational control and trust dynamics?',
            'How can automation tools be guided to commit to values and self-monitor adherence?',
            'How are workers affected when some tasks are automated while others are augmented?',
            'What skills become essential as organizations implement synergy of automation and augmentation?'
          ],
          risk: 'Overautomation leads to loss of human judgment, organizational rigidity, and inability to handle novel situations. Over-augmentation creates inefficiency, unclear accountability, and resistance to beneficial automation. Workers experience stress from unclear boundaries between automated and augmented tasks.',
          governance: 'Establish criteria for automation vs augmentation decisions (routine/high-volume tasks → automation; complex/judgment-required tasks → augmentation). Implement hybrid approaches combining both. Create feedback mechanisms for workers to report augmentation failures or automation gaps. Develop trust-based rather than purely control-based management approaches.',
          success: 'Clear criteria guide automation vs augmentation choices. Workers understand which tasks are automated vs augmented. Hybrid implementations achieve efficiency gains without sacrificing human judgment. Trust mechanisms complement control structures. Workforce reports positive well-being despite task reconfigurations.'
        }
      }
    },
    engagement: {
      name: 'Engagement',
      description: 'AI-enabled engagement using chatbots, conversational AI, and emotion AI to understand, respond, and converse using natural language. Technologies range from simple query handlers to complex ML-powered agents with reasoning, prediction, and emotional display capabilities. Used across finance, commerce, healthcare, and customer service.',
      technologies: ['Chatbots', 'Conversational AI', 'Emotion AI (Affective Computing)', 'Natural Language Processing', 'Voice Assistants'],
      tensions: {
        humanlike: {
          name: 'Humanlike vs Machinelike Conversations',
          challenge: 'Organizations design conversational AI with anthropomorphism (personality, social presence, humor) to improve experience and conversion rates. However, excessive humanlike attributes trigger "oscillation effect" where users alternate between treating bot as human and probing its limits, causing negative consequences. In some contexts (procedural tasks), machinelike interaction is more appropriate than social connection.',
          opportunity: 'Investigate features evoking "humanness" in physical robots vs conversational AI. Identify settings where anthropomorphism increases trust/acceptance vs where it\'s redundant. Study ethical implications: does anthropomorphism make users more vulnerable when following suggestions? How is accountability managed for anthropomorphic agents? Expand engagement models to account for direct and indirect use configurations.',
          questions: [
            'What features of physical robots most likely evoke "humanness" and with what consequences?',
            'What technology features or combinations suffice to evoke "humanness" without uncanny valley?',
            'Under what conditions is anthropomorphism needed to evoke trust vs seen as redundant?',
            'How does anthropomorphism make users vulnerable and how should accountability be managed?',
            'How do interdependencies in indirect use impact organizational outcomes?',
            'What happens to human engagement when AI enables full automation eliminating information use?'
          ],
          risk: 'Excessive anthropomorphism creates trust in unreliable systems leading to poor decisions. Oscillation effect causes user frustration and withdrawal. Lack of transparency about bot vs human agent erodes trust. Vulnerable users manipulated by emotionally persuasive bots. Regulatory violations for undisclosed automated agents.',
          governance: 'Establish anthropomorphism guidelines specifying appropriate humanlike features per context. Implement transparency requirements (disclose bot vs human). Create emotional boundary policies preventing manipulation. Test for oscillation effects in user studies. Develop accountability protocols for anthropomorphic agent errors.',
          success: 'Users appropriately calibrated to bot capabilities (no over-trust or under-trust). Anthropomorphism enhances experience without triggering oscillation. Transparency about automation maintains user agency. Emotional boundaries prevent manipulation. Accountability clear when anthropomorphic agents err.'
        },
        emotion: {
          name: 'Human vs Artificial Emotion Intelligence',
          challenge: 'Emotion AI reads words, images, facial expressions, gestures, voice, heart rate to sense and respond to human emotions (interest, anger, distress, pleasure). Enhances human-machine interaction by making technology adaptive, but machines must be trained when to respond vs ignore emotions. Raises ethical concerns about emotional/mental privacy, nudge theory abuse, and bias (emotions are highly contextual and cultural).',
          opportunity: 'Investigate socioemotional aspects of AI using three emotion systems (physiology, language, behavior) to identify unintended consequences on human behavior. Study level of emotional display appropriate for different contexts—whether adaptation to human emotions increases acceptance or introduces control/privacy concerns. Examine whether AI can emulate emotional intelligence and with what effects.',
          questions: [
            'To what extent can AI tools emulate emotional intelligence that is typically a human trait?',
            'How does perceived artificial emotional intelligence affect usage and acceptance?',
            'Under what conditions does artificial emotional intelligence turn users away?',
            'How does artificial emotional intelligence affect stakeholders who don\'t directly interact with AI?',
            'What level of emotional display by machines is most appropriate for different contexts?',
            'How can understanding emotions remove ambiguity vs introduce undesirable control?'
          ],
          risk: 'Emotional privacy violations from sentiment/facial/voice monitoring without consent. Manipulation through emotional nudging undermining autonomy. Bias amplification due to subjective nature of emotions and cultural variability. Erosion of human emotional skills if machines handle all emotional labor. Regulatory exposure for undisclosed emotion tracking.',
          governance: 'Establish consent requirements for emotion tracking (facial, voice, physiological). Create policies on when emotion response is appropriate vs when emotions should be ignored. Implement bias audits for emotion recognition systems across demographics. Set boundaries on emotional nudging to prevent manipulation. Train systems on cultural variability in emotional expression.',
          success: 'Emotion tracking limited to consented contexts. Bias minimized across demographics and cultures. Emotional responses contextually appropriate (anger acknowledged in service failures, ignored in routine transactions). Users maintain emotional autonomy despite AI emotion adaptation. Regulatory compliance for emotion data collection and use.'
        }
      }
    },
    insight: {
      name: 'Insight/Decisions',
      description: 'AI-enabled insights using ML algorithms (supervised learning, deep learning neural networks) to analyze structured data, learn from labeled data, and accomplish classification, prediction, and recognition tasks. Examples: loan approval from client parameters, face recognition for building access, stock prediction from patterns. Neural networks can analyze millions of data points exceeding human comprehension.',
      technologies: ['Machine Learning Algorithms', 'Deep Learning Neural Networks', 'Predictive Analytics', 'Rule-Based Expert Systems', 'Automated Decision-Making'],
      tensions: {
        accountability: {
          name: 'Decision Accountability: Humans vs Machines',
          challenge: 'Machines lack sense of self or purpose—responsibility requires intentionality, which machines cannot manifest. Humans define implementation but find themselves unable to take responsibility when automated decisions made with speed/inputs exceeding human comprehension. Complacency emerges if humans rely too greatly on AI. Lack of transparency in automated decision-making prevents providing reasons underlying actions required for accountability.',
          opportunity: 'Study how AI integration changes individual/organizational decision-making practices. Investigate extent of AI tool integration and factors affecting use propensity (learning scale, perceived usefulness). Examine power tensions as algorithmic authority displaces established institutions (TripAdvisor algorithm vs AAA hospitality standards). Analyze how AI redefines organizational design and information processing capabilities.',
          questions: [
            'How do individuals integrate insights from ML algorithms into their decision-making procedures?',
            'What factors affect users\' propensity to rely on AI-generated output in decisions?',
            'How do power struggles unfold as algorithmic authority displaces established institutions?',
            'How does AI redefine firm organizational design approaches and information processing?',
            'How do vertical and horizontal information structures change as AI performs more decisions?',
            'What mechanisms maintain human accountability when AI makes decisions at superhuman speed/scale?'
          ],
          risk: 'Accountability gaps when algorithmic decisions cause harm but no agent (human or machine) can be held responsible. Complacency leads to uncritical acceptance of flawed AI recommendations. Black-boxed algorithms prevent understanding why actions were performed. Loss of institutional authority as algorithms displace established standards. Organizational rigidity if AI redefines information flows without human oversight.',
          governance: 'Establish accountability protocols assigning human responsibility for AI decisions even when speed/complexity exceeds comprehension. Implement explainability requirements enabling humans to provide reasons for algorithmic actions. Create feedback mechanisms preventing complacency (require human review for high-stakes decisions). Maintain institutional oversight as algorithms gain authority. Document information flow changes from AI integration.',
          success: 'Clear accountability assignment for all algorithmic decisions despite speed/complexity. Explainability enables humans to provide reasons underlying AI actions. Complacency prevented through mandatory review protocols. Institutional authority maintained alongside algorithmic influence. Information flows adapted intentionally rather than emergently.'
        },
        bias: {
          name: 'Human vs Machine Bias',
          challenge: 'Managers assume automating decisions with AI removes human bias (gender, ethnicity, postal code discrimination). However, new biases emerge from training datasets, noisy data, statistical errors leading to systematic discrimination. Examples: racist recidivism prediction algorithms, hiring tools discriminating against women in STEM. Machine bias can be more systematic and invisible than human bias.',
          opportunity: 'Investigate data practices developers should employ to avoid bias including training dataset quality checks and regular audits for accumulated biases/path dependencies. Study how developers incorporate explainability and transparency to track potential machine biases. Examine new visibility and control forms as AI analyzes trace data from business operations, enabling unprecedented surveillance of work performance.',
          questions: [
            'What data practices help developers avoid bias in training datasets and path dependencies?',
            'How can developers incorporate explainability and transparency to track machine biases?',
            'How does AI bring about new types of visibility and control in organizations?',
            'How does trace data analysis and performance monitoring affect employee attitudes and behaviors?',
            'Do employees engage in counteractions to distort data entered into AI algorithms?',
            'How do transparency and explainability alleviate employee counteractions and restore trust?'
          ],
          risk: 'Systematic discrimination amplified at scale (racist recidivism predictions, gender-biased hiring). Training data bias creates path dependencies difficult to detect/correct. Lack of explainability prevents identifying bias sources. Employee surveillance through trace data analysis creates stress and counterproductive behaviors. Loss of trust when machine bias discovered after deployment.',
          governance: 'Implement rigorous training dataset audits for demographic representation and historical bias. Require explainability enabling bias detection and correction. Conduct regular bias audits post-deployment for accumulated biases. Establish transparency about trace data collection and performance monitoring. Create channels for reporting suspected bias. Develop remediation protocols for detected bias.',
          success: 'Training datasets audited for bias before deployment. Explainability enables bias detection and attribution. Post-deployment audits catch accumulated biases. Trace data collection transparent to employees. Bias remediation protocols executed when issues detected. Employee trust maintained despite algorithmic evaluation.'
        },
        rationality: {
          name: 'Machine Rationality vs Human Judgment',
          challenge: 'ML algorithms overcome bounded rationality through logical/mathematical procedures, vast data processing, and efficient self-learning. However, overreliance distances individuals from decision-making process, erodes intuitive judgment, creates emotional detachment, reduces sense of responsibility, and causes passive acceptance without exercising judgment. Humans may feel "helpless" when dominated by algorithms.',
          opportunity: 'Study how humans interact and collaborate with AI tools to solve problems. Investigate whether AI augmentation increases or decreases work performance (may frustrate individuals if recommendations unintelligible, causing diagnostic doubt). Examine emergence of translator roles interpreting AI predictions. Explore ethical considerations in accountability assignment and unintended consequences from automated decision-making.',
          questions: [
            'How do humans interact and collaborate with AI tools to solve problems effectively?',
            'Does AI augmentation increase or decrease work performance and under what conditions?',
            'How do domain experts collaborate with data scientists and translators to transfer tacit knowledge?',
            'What practices assign accountability when ML algorithm insights affect crucial decisions?',
            'What unintended consequences arise as AI integrates into decision-making practices?',
            'Should developers enable reverse engineering of ML insights to investigate errors and assign accountability?'
          ],
          risk: 'Loss of human judgment capability through overreliance on algorithmic recommendations. Emotional detachment from decision outcomes when algorithms dominate. Passive acceptance without critical evaluation. Frustration when unintelligible recommendations cause work delays. Accountability gaps when algorithmic decisions cause harm. Data harm from incorrect/inappropriately preprocessed data.',
          governance: 'Establish criteria for when human judgment overrides algorithmic recommendations. Require explainability making recommendations intelligible. Create translator/facilitator roles bridging algorithms and domain experts. Implement accountability protocols for AI-influenced decisions. Develop reverse engineering capabilities for investigating algorithmic errors. Establish data harm remediation processes.',
          success: 'Humans maintain judgment capability despite AI assistance. Recommendations intelligible enabling critical evaluation. Translator roles successfully bridge algorithms and experts. Accountability clear for AI-influenced decisions. Reverse engineering available for error investigation. Data harm identified and remediated quickly.'
        },
        myopia: {
          name: 'Learning vs Myopia',
          challenge: 'AI should help organizations decrease search costs, make better sense of environment, and understand how environment responds to actions. However, overreliance on algorithms with limited human intervention risks path dependency and new learning myopia. Temporal myopia (short-sightedness about past/future) and reduced diversity in routines/knowledge limit variation (critical for exploration) and adaptation. Historical data can\'t predict unprecedented situations (COVID-19).',
          opportunity: 'Study long-term impact of automated decision-making on human cognitive capabilities. Investigate how automation leads to deskilling and loss of expert human cognitive skills. Examine organizational cognitive capabilities impact and how to maintain creativity/spontaneity while leveraging AI efficiency. Explore data practices preventing path dependencies and analytical approaches for unprecedented situations when historical data insufficient.',
          questions: [
            'How do automated decision-making processes impact organizational cognitive capabilities long-term?',
            'How can organizations maintain creativity and spontaneity while leveraging AI efficiency?',
            'What data practices help developers avoid path dependencies in training datasets?',
            'What analytical practices do data scientists use for unprecedented situations without historical data?',
            'How does loss of expert human cognitive skills limit organizational flexibility and creativity?',
            'What happens to organizational learning when ML reduces diversity in routines and knowledge?'
          ],
          risk: 'Path dependency from algorithms trained exclusively on historical data. Temporal myopia preventing anticipation of novel situations. Reduced organizational diversity limiting variation and adaptation. Loss of tacit expertise not codified in algorithms. Organizational rigidity when unprecedented situations arise. Deskilling of workforce through automation of cognitive tasks.',
          governance: 'Implement diverse data sourcing preventing path dependency on single historical corpus. Require human oversight for unprecedented situations where historical data insufficient. Maintain tacit expertise through selective non-automation of complex judgment tasks. Create exploration mechanisms introducing variation despite automation. Establish protocols for adapting algorithms when historical patterns break down. Monitor cognitive skill maintenance across workforce.',
          success: 'Path dependencies identified and mitigated through diverse data sources. Unprecedented situations trigger human oversight rather than blind algorithmic application. Tacit expertise maintained alongside automation. Organizational diversity preserved enabling adaptation. Cognitive skills monitored and maintained. Algorithms adapted when historical patterns prove insufficient.'
        }
      }
    },
    innovation: {
      name: 'Innovation',
      description: 'AI-enabled innovation using ML and deep learning to automate or enhance innovation processes and outcomes. Data-driven insights, models, and visualizations facilitate creative interpretation supporting decision-making within innovation. Deep learning accelerates new product development (pharmaceutical drug discovery, biotech validation). AI may not independently develop entire solutions but points managers toward promising avenues.',
      technologies: ['Generative AI', 'Deep Learning Neural Networks', 'Algorithmic R&D', 'Computer-Assisted Discovery', 'ML-Driven Design'],
      tensions: {
        exploration: {
          name: 'Exploration vs Exploitation',
          challenge: 'Large training data requirements for ML to generate creative ideas creates tension between exploration (shift away from current knowledge base) vs exploitation (build on existing knowledge). AI benefits domains with abundant data (exploitation) but struggles with novelty or limited-data contexts requiring tacit knowledge costly to digitize. Creativity and deeper insights from small rich data not well-suited for AI. Crowd data generation requires increasing resources for declining data quality.',
          opportunity: 'Study how AI technologies affect creativity and exploration/exploitation balance. Investigate settings where abundant data enables AI-driven innovation vs where limited data/novelty requirements necessitate human creativity. Examine data resourcing requirements and crowd-based data generation challenges. Explore how AI serves as general-purpose "method of invention" reshaping R&D organization.',
          questions: [
            'How do AI technologies affect organizational creativity and innovation processes?',
            'Under what conditions does abundant data enable AI-driven innovation vs limited data require human creativity?',
            'What data resourcing requirements constrain AI-enabled innovation in different domains?',
            'How does AI serve as a general-purpose "method of invention" reshaping R&D organization?',
            'What role does tacit knowledge play in domains where AI struggles to innovate?',
            'How can organizations balance exploration (novelty) and exploitation (data-driven efficiency) in AI-enabled innovation?'
          ],
          risk: 'Overemphasis on exploitation through AI limits exploration and novelty. Domains with limited data underserved by AI-driven innovation. Tacit knowledge loss if AI replaces human creativity in rich-data-poor contexts. Crowd data quality declines requiring increasing resources. Innovation confined to historical patterns unable to generate true novelty. R&D becomes reactive to data availability rather than proactive exploration.',
          governance: 'Maintain human-led exploration alongside AI-driven exploitation. Establish criteria for when abundant data enables AI vs when novelty requires human creativity. Protect domains with limited data from premature AI automation. Codify tacit knowledge where possible but preserve human expertise. Monitor crowd data quality and resource allocation. Balance data-driven efficiency with exploratory risk-taking.',
          success: 'Exploration and exploitation balanced based on data availability and novelty requirements. AI applied where abundant data exists; human creativity where limited data. Tacit knowledge preserved alongside AI capabilities. Crowd data quality maintained through incentive alignment. True novelty generated alongside pattern-based innovation. R&D proactively explores despite AI constraints.'
        },
        credit: {
          name: 'Credit Allocation in AI-Enabled Innovation',
          challenge: 'Algorithms increasingly create diverse innovative outcomes (generate software, produce designs, identify compounds) as autonomous "innovators" beyond enablers. Difficult to determine precisely what creators have created. AI algorithms (as understood today) cannot be credited with authorship or copyright—they depend on algorithm creator, training team, and parameter modifiers. Proposed solution: grant authorship to AI programmers and owners, but this raises incentive allocation questions.',
          opportunity: 'Examine role of AI technology in enabling innovation processes and outcomes plus allocation of incentives and credit. Investigate how organizations attribute authorship for AI-generated innovations. Study impact on R&D organization and incentive structures. Explore legal and policy implications of AI authorship and intellectual property rights for algorithmic creations.',
          questions: [
            'How should organizations attribute authorship and credit for AI-generated innovations?',
            'What incentive structures motivate teams developing AI systems that generate innovations?',
            'How does AI\'s role as autonomous innovator affect R&D organization and knowledge flows?',
            'What legal and policy frameworks should govern intellectual property for AI-generated outputs?',
            'How do traditional notions of creativity and invention apply to algorithmic innovations?',
            'What impact does AI authorship ambiguity have on motivation and career development in R&D?'
          ],
          risk: 'Incentive misalignment when algorithm creators receive credit but training teams contribute equally. Reduced motivation if authorship ambiguity prevents career recognition. Legal uncertainty about IP rights for AI-generated innovations. Windfall gains to algorithm owners despite distributed innovation contributions. Underinvestment in AI-assisted innovation due to credit allocation uncertainty.',
          governance: 'Establish explicit authorship policies for AI-generated innovations balancing algorithm creators, training teams, and owners. Create incentive structures recognizing distributed contributions. Develop IP frameworks clarifying rights for algorithmic outputs. Implement career development pathways for AI-assisted innovation roles. Communicate policies transparently preventing motivation erosion.',
          success: 'Authorship policies balance algorithm creators, training teams, and owners fairly. Incentive structures motivate all contributors to AI-enabled innovation. IP rights clarified enabling investment decisions. Career pathways recognize AI-assisted innovation contributions. Motivation maintained despite authorship ambiguity. Legal certainty supports innovation investment.'
        }
      }
    }
  };
  
  function init() {
    const capabilitySelect = document.getElementById('p48-capability');
    const tensionSelect = document.getElementById('p48-tension');
    
    if (!capabilitySelect || !tensionSelect) {
      console.warn('Paper 48 interactive elements not yet in DOM, skipping initialization');
      return;
    }
    
    capabilitySelect.addEventListener('change', updateCapability);
    tensionSelect.addEventListener('change', updateTension);
    
    // Initialize with automation capability
    updateCapability();
  }
  
  function updateCapability() {
    const capabilitySelect = document.getElementById('p48-capability');
    const tensionSelect = document.getElementById('p48-tension');
    const capabilityDesc = document.getElementById('p48-capability-description');
    
    if (!capabilitySelect || !tensionSelect || !capabilityDesc) return;
    
    const capabilityKey = capabilitySelect.value;
    const capability = frameworkData[capabilityKey];
    
    // Update capability description
    capabilityDesc.textContent = capability.description;
    
    // Populate tension dropdown
    tensionSelect.innerHTML = '';
    Object.keys(capability.tensions).forEach(tensionKey => {
      const tension = capability.tensions[tensionKey];
      const option = document.createElement('option');
      option.value = tensionKey;
      option.textContent = tension.name;
      tensionSelect.appendChild(option);
    });
    
    // Update tension details
    updateTension();
  }
  
  function updateTension() {
    const capabilitySelect = document.getElementById('p48-capability');
    const tensionSelect = document.getElementById('p48-tension');
    const tensionDesc = document.getElementById('p48-tension-description');
    const challengeEl = document.getElementById('p48-challenge');
    const opportunityEl = document.getElementById('p48-opportunity');
    const questionsEl = document.getElementById('p48-questions');
    const riskEl = document.getElementById('p48-risk');
    const governanceEl = document.getElementById('p48-governance');
    const successEl = document.getElementById('p48-success');
    
    if (!capabilitySelect || !tensionSelect) return;
    
    const capabilityKey = capabilitySelect.value;
    const tensionKey = tensionSelect.value;
    const capability = frameworkData[capabilityKey];
    const tension = capability.tensions[tensionKey];
    
    // Update tension description
    if (tensionDesc) {
      tensionDesc.textContent = `This tension emerges as organizations deploy ${capability.name.toLowerCase()} capabilities using ${capability.technologies.slice(0, 2).join(', ')}.`;
    }
    
    // Update challenge and opportunity
    if (challengeEl) challengeEl.textContent = tension.challenge;
    if (opportunityEl) opportunityEl.textContent = tension.opportunity;
    
    // Update research questions
    if (questionsEl) {
      questionsEl.innerHTML = '';
      tension.questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'panel panel-neutral-soft p-3 text-xs panel-muted';
        questionDiv.textContent = question;
        questionsEl.appendChild(questionDiv);
      });
    }
    
    // Update practical implications
    if (riskEl) riskEl.textContent = tension.risk;
    if (governanceEl) governanceEl.textContent = tension.governance;
    if (successEl) successEl.textContent = tension.success;
  }
  
  // Export function to be called by paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0); // Wait a tick for DOM
  }
  
  // Attach helper functions for testing
  interactiveScript.init = init;
  interactiveScript.updateCapability = updateCapability;
  interactiveScript.updateTension = updateTension;
  
  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();

---
title: Run 3 Reinforcement Learning Agent
category: ai-ml
date: "2025-12-01"
link: "https://github.com/MalcolmCS15/Run-3-RL-Agent"
featuredRank: 1
tags:
  - PPO
  - TensorFlow
  - CNNs
  - Weights & Biases
  - Python
  - E2E
badge: 🏆 First-ever RL agent for Run 3
featured: true
role: lead
featuredImage: /images/projects/run3-gradcam.gif
featuredImagePoster: /images/projects/run3-gradcam-poster.png
featuredImageCaption: 'The clip shows the live GradCAM overlay: warm regions are where the CNN is "looking" as it picks each action.'
---

Created the first-ever agent trained with reinforcement learning to successfully play Run 3 "infinite mode" — a 3D parkour game.

## Highlights

- Applied DL/RL theory to tackle a novel problem e2e, finding practical solutions to real-world complications as they arose
- Configured the environmnet to allow the agent to interface with the keyboard and play the game live, enabling real-time model optimization
- Trained the agent with a CNN/PPO framework, tracking metrics like episode length and value loss with Weights & Biases
- Achieved an impressive 45 seconds of non-stop autonomous 3D parkour after only ~20 hours of live training
- Visualized the policy's attention with per-frame GradCAM overlays on live gameplay
- Identified a workaround when our model started "reward hacking" by sitting still and collecting survival rewards
- Presented a project poster on findings

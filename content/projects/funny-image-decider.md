---
title: Funny Image Decider
category: ai-ml
date: "2026-03-01"
link: "https://github.com/MalcolmCS15/Funny-Image-Decider"
tags:
  - Python
  - TensorFlow
  - Keras
  - CNN
  - Transfer Learning
  - GradCAM
role: independent
---

A binary image classifier that predicts whether an image is "funny or not funny," trained on Kreiman Lab's HumorDB dataset to grade my own cartoon.

## Highlights
- Built and compared two approaches: a CNN trained from scratch vs transfer learning with pretrained backbones (MobileNetV2, EfficientNetB0) with configurable layer freezing
- Added GradCAM heatmaps to visualize which regions drove each prediction, plus data augmentation, early stopping, and live-updating loss/accuracy plots
- Honestly evaluated the limits — ~56% validation accuracy on the small (~3,500-image) dataset, with attention landing on incidental features rather than real humor cues
- BONUS: Disagreed with the model's output (which claimed my cartoon was not funny!)

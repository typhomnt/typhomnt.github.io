---
title: "Laban Effort classification"
date: 2019-02-20T16:22:09+01:00
draft: true
---

This article present our results on Laban Effort classication for motion quality recognition. Rudolf Laban is a choregrapher who proposed a motion theory qualifying movement in terms of **Space, Time and Weight**... Considering a motion segment as a 6D curve, storing position and orientations, we worked on two different approaches in attemps to classify motions into the Laban Action Effort. The two approaches relies on geometric features studies. For each point of a given 6D curve we compute its speed, acceleration, jerk, equi-affined speed, equi-affine acceleration, torsion and curvature.
We first used a naived Bayes classification ... In order to improve our classification results, we trained 8 different HMM for each Laban Verb (Dab,Flick,Float,Press,Thrust,Glide,Wring,Slash).
Here are the classification results. Each HMM has a 8 fully connected hidden configuration. We achieve a 38 % classification rate for Laban Verbs as well as 91 % rate for the time category, 61 % for the weight category and 45 % for the space category.
![Current delta log for space class](/Images/Laban_Classification/Indirect_Direct_delta_log.png)

---
title: First rant
date: 2026-09-13
description: Finally, an actual website.
tags:
  - hi
authors:
  - name: minus
---

## Hi!!!

I decided to finally put together a shitty website. At least it's made with Hugo, so I don't have to deal with most of the problems that come with building a small and cute :3 website.

This space of mine will be used to talk about many things I fear, but my current obsession is getting the Wii U Gamepad to connect to a PC without hiccups of any sort AND with actual ease of use.

For anyone who doesn't know, there's already a [way](https://libdrc.org) to connect the infamous controller to a normal computer, but the process is manual, tedious and doesn't work very well. There are some fixes and patches listed at the end of [this webpage](https://sheepy.moe/blog/libdrc) (check it out! it also helps with the installation, if you wanna take a crack at it :P), but they don't seem to work that well for me either.

## Intel journey

My first efforts were sadly wasted trying to make my Intel wifi card talk to the Gamepad. For more context, please check [sheepy's blog](https://sheepy.moe/blog/libdrc) (I believe it would make my friend happy :3).

Yes, Intel makes wifi cards. Mainly for laptops... if you have a laptop with an Intel CPU, there's a high chance the wifi card is Intel too.

### TSF

I wrote a kernel patch for the iwlwifi driver, which is the driver for many (if not all) Intel wifi cards. Maybe the very first Intel wifi card isn't supported; I don't know. Anyway, the patch was for exporting the TSF (Timing Synchronization Function) value *outside* the driver, which was surprisingly possible and not even that hard! Again, if you don't even know what TSF is, I highly suggest you look at my friend's blog.

Like many other cards, Intel's don't let you read the value, because it's genuinely useless for the computer to know what it is. I mean sure, there you go, a microsecond-precise counter for free! Most cards, being consumer cards, can't be bothered with that.

...or can they?

So basically I (my Claude) discovered that inside the driver's code, a special value called `gp2` represented a 32-bit counter that (guess what) was driven by a 1 MHz oscillator (1 MHz = one tick every 1/1000000 of a second = 1 microsecond)! I was so happy at first, so much so that I believed `gp2` to be the TSF I was looking for.

Unfortunately, it wasn't. But with some fuckass tests (flooding the kernel log with numbers) I did find out that the values are actually synced, and more importantly I found the real TSF value, and turned it into an offset to use with `gp2`, making the most accurate representation of TSF you can get out of an Intel wifi card.

sheepy tested the patch with her AX210 and confirmed it worked. I couldn't test it. Why???

### Moloch or LAR

Radio equipment has been in use for ages, for all sorts of purposes: entertainment, toys, communication, all sorta stuff. Ships and navies got there first, back when radio was just telegraphy through the air. Then airplanes, then the household radio set, then TV, etc. etc... And the more stuff piled onto the air, the more it all stepped on each other: in 1912 amateur chatter famously got in the way of the Titanic's distress calls, and the first real radio laws followed within months. Spectrum is shared and finite, and nobody gets to use it if everybody just transmits whatever they want. Therefore: **regulations**.

I'm not against them, don't get me wrong. I'm against Intel.

Wifi has regulations too: some regions of the world let you have 5 GHz wifi, some don't, some only block a specific frequency... It's fairly complicated, but both routers and wifi cards have to comply somehow.

Fun fact about me: I live in Italy, so I get the EU rules. CEPT and the European Commission decide what the spectrum is for, and [ETSI](https://www.etsi.org/about/) writes the standard your card actually gets tested against, EN 301 893. It covers three chunks of 5 GHz: 5150 to 5250 MHz (channels 36 to 48), 5250 to 5350 (52 to 64) and 5470 to 5725 (100 to 140). The low chunk is the friendly one, no DFS and no TPC needed, but it's **indoor only** and capped at 200 mW. The other two want both.

Channels 149 to 165 aren't on that list, and it's not an oversight. 5725 to 5875 is the ISM band, and in Europe you get it under the generic short range device rules at **25 mW**, an eighth of what you're allowed indoors on channel 36. CEPT studied opening it up for wifi properly and concluded that no harmonisation measure was planned. It only landed in EN 301 893 as a fourth sub-band at the end of 2024, applicable from August 2025.

What's the deal with all this sparse information? Why am I lecturing you about regulations? Well, because Intel fucked up bad.

To comply with regulations back then, the OS used to tell the card its region, and the card would block the appropriate frequencies/features/etc. These days, though, a lot of wifi cards (Intel's included) implement a firmware feature called LAR (Location Aware Regulatory) (note: Intel calls it LAR, but the principle is the same for many other cards).

What it does is very simple: it scans the area, looks at the routers nearby, checks their country code (two bytes sent by the router) and, with a magic formula we will never know, automatically picks the region for you.

Sounds smart on the surface. Shame it's unreliable as fuck for some people (picking Indonesian/Chinese regulations when living in the US) and straight up wrong for others, like me.

In very few words: **Intel believes that Italy can't use low 5 GHz networks**.

"Why the bitching?" one might ask, and I'll let them in on a secret: Intel wifi cards are the best for Linux. They're the best supported. They have the best stability. Why Intel would do something like this to all of us geeks, we'll never know.

#### Firmware RE tangent

So what could I possibly do, if not get my hands dirty with machine code? Hehehe >:3

I'm too eepy to write this story right now, but my findings brought me to this:

- For Italians who have the AC9560 card and have found a method to bypass its secure boot: open the file `iwlwifi-9000-pu-b0-jf-b0-46.ucode` (found in `/lib/firmware`) with your preferred hex editor and overwrite address `0xd3c67` with the number 2. This MIGHT solve all your problems.

TODO: WRITE THIS SECTION

### Old regulations

Well, that was a complete waste of time (for me at least).

At least I have all the freedom regarding high 5 GHz networks... could that be useful in any way? Asking myself that, the next question came instantly: couldn't the Gamepad connect over high 5 GHz too?

No.

I tried and tried, with both my Intel wifi card and my trusty wifi dongle (the one I use regularly for libdrc testing!), but no, hostapd got ignored every time.

The problem is, sheepy could connect her Gamepad to her PC over high 5 GHz, and Famidawg even told me that Gamepads scan both low and high 5 GHz and pick the least congested (ofc).

TODO: WRITE THIS SECTION BETTER

Why couldn't I connect? REGULATIONS, ALWAYS regulations. Every wifi device has to follow the rules of the region it's sold in, consoles included. Back in 2012 the regulations for high 5 GHz were stricter than they are now, and as covered above, in the EU that band wasn't a wifi band at all, so my European Gamepad straight up skips channels 149 to 165. I tested this to death. sheepy and Famidawg have US consoles, which got the whole band, and that is the entire reason it works for them and not for me.

Funny how Intel believes the opposite. On one hand I've got a modern device that thinks low 5 GHz is bad; on the other, an old device that thinks high 5 GHz is bad. FUUUUUUUUUUCKKKKKKKKKK

I hope you can sympathize with my frustration.

## Where am I at now?

I've decided to shift my focus from connectivity to video codecs, because the main issue with libdrc really is just video streaming: it glitches and desyncs.

From what I know, it could be a billion things: bad connectivity, bad TSF values, wrong x264 settings, etc etc...

So I thought: what can I remove from the equation?

And, madman that I am, I decided to "reverse engineer" the Wii U's h264 codec. :D

I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy I am not crazy 

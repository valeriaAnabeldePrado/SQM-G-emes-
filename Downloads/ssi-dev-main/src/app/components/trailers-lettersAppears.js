"use client";
import React, { useEffect, useRef, useState } from "react";
import "./trailers-lettersAppears.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Appears = ({ title = "", phrase }) => {
  const refs = useRef([]);
  const container = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const splitWords = () => {
    let body = [];
    phrase.split(" ").forEach((word, index) => {
      const letters = splitLetters(word);
      body.push(<p key={`word_${index}`}>{letters}</p>);
    });
    return body;
  };

  const splitLetters = (word) => {
    let letters = [];
    word.split("").forEach((letter, index) => {
      letters.push(
        <span
          ref={(el) => {
            refs.current.push(el);
          }}
          key={`letter+${index}`}
        >
          {letter}
        </span>
      );
    });

    return letters;
  };

  useEffect(() => {
    if (container.current && shouldAnimate) {
      gsap.registerPlugin(ScrollTrigger);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top center-=150px",
          end: `bottom top`,
          scrub: 4,
        },
      });

      tl.to(refs.current, {
        opacity: 1,
        ease: "none",
        stagger: 1,
      });

      return () => {
        tl.kill();
      };
    }
  }, [shouldAnimate]);

  useEffect(() => {
    // Activar la animación si hay frase
    if (phrase) {
      setShouldAnimate(true);
    }
  }, [phrase]);

  return (
    <div ref={container} className="letters-main">
      <h2 className="letters-ap-title">{title}</h2>
      <div className="apperas">{splitWords(phrase)}</div>
    </div>
  );
};

export default Appears;

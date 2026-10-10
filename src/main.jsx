import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.css';
import peopleMotionStill from './people-motion-still.png';
import PaperStack from './PaperStack';

gsap.registerPlugin(ScrollTrigger);

const CDN = 'https://hardhardfish.dpdns.org';

const assets = {
  arrow1: `${CDN}/arrow1.svg`,
  arrow2: `${CDN}/arrow2.svg`,
  arrow3: `${CDN}/arrow3.svg`,
  bgHome: `${CDN}/bg-home.png`,
  bgRectangle: `${CDN}/BG-rectangle.png`,
  aiComputer: `${CDN}/ai-computer.png`,
  coffee: `${CDN}/coffee.png`,
  computerScreen: `${CDN}/computer-screen.png`,
  flow: `${CDN}/flow.png`,
  folder: `${CDN}/folder.png`,
  folder1: `${CDN}/folder1.png`,
  folderPage2: `${CDN}/folder-page2.png`,
  folderPage3: `${CDN}/folder-page3.png`,
  folderPage4: `${CDN}/folder-page4.png`,
  folderPage5: `${CDN}/folder-page5.png`,
  iconClose: `${CDN}/icon-close.svg`,
  iconRight: `${CDN}/icon-right.svg`,
  iconDown: `${CDN}/icon-down.svg`,
  braces: `${CDN}/braces%E2%80%8C.svg`,
  polygon1: `${CDN}/Polygon%201.svg`,
  polygon2: `${CDN}/Polygon%202.svg`,
  polygon3: `${CDN}/Polygon%203.svg`,
  polygon4: `${CDN}/Polygon%204.svg`,
  cardIcon1: `${CDN}/card-icon1.svg`,
  cardIcon2: `${CDN}/card-icon2.svg`,
  cardIcon3: `${CDN}/card-icon3.svg`,
  cardIcon4: `${CDN}/card-icon4.png`,
  cardIcon5: `${CDN}/card-icon5.png`,
  cardIcon6: `${CDN}/card-icon6.png`,
  cardIcon7: `${CDN}/card-icon7.png`,
  point1: `${CDN}/point1.svg`,
  point2: `${CDN}/point2.svg`,
  point3: `${CDN}/point3.svg`,
  point4: `${CDN}/point4.svg`,
  iphone: `${CDN}/iphone.png`,
  iphone2: `${CDN}/iphone2.png`,
  keyboard: `${CDN}/keyboard.png`,
  leave: `${CDN}/leave.png`,
  message: `${CDN}/message.png`,
  notebook: `${CDN}/notebook.png`,
  paper: `${CDN}/paper.png`,
  paper2: `${CDN}/paper2.png`,
  penCup: `${CDN}/pen-cup.png`,
  beautyThumbnail: `${CDN}/beatuy-thumbnail.png`,
  posterThumbnail1: `${CDN}/poster-thumbnail1.png`,
  posterThumbnail2: `${CDN}/poster-thumbnail2.png`,
  brandThumbnail: `${CDN}/brand-thumbnail.png`,
  ipThumbnail: `${CDN}/IP-thumbnail.png`,
  chart: `${CDN}/chart.png`,
  userJourney: `${CDN}/user%20journey.png`,
  prd: `${CDN}/prd.png`,
  wireframe: `${CDN}/wireframe.png`,
  design: `${CDN}/design.png`,
  demo: `${CDN}/demo.png`,
  beautyTopBg: `${CDN}/beauty-top-bg.webp`,
  brandTopBg: `${CDN}/brand-top-bg.webp`,
  coffeeBag: `${CDN}/bag.png`,
  coffeePaper: `${CDN}/brand-paper.jpg`,
  coffeeCup: `${CDN}/cup.png`,
  coffeeScene1: `${CDN}/coffeescene1.jpg`,
  coffeeScene2: `${CDN}/coffeescene2.jpg`,
  coffeeScene3: `${CDN}/coffeescene3.jpg`,
  coffeeScene4: `${CDN}/coffeescene4.jpg`,
  coffeeScene5: `${CDN}/coffeescene5.jpg`,
  coffeeScene6: `${CDN}/coffeescene6.jpg`,
  coffeeLogo: `${CDN}/logo.jpg`,
  coffeePrompt4: `${CDN}/prompt4.jpg`,
  coffeePrompt5: `${CDN}/prompt5.jpg`,
  coffeePrompt6: `${CDN}/prompt6.jpg`,
  coffeePrompt7: `${CDN}/prompt7.jpg`,
  coffeePrompt8: `${CDN}/prompt8.jpg`,
  coffeeChart1: `${CDN}/chart1.jpg`,
  uxMainKv: `${CDN}/主KV.jpg`,
  uxBannerThumbnail: `${CDN}/banner-thumbnail.jpg`,
  uxBanner1: `${CDN}/banner1.jpg`,
  uxBanner2: `${CDN}/banner2.jpg`,
  uxBanner3: `${CDN}/banner3.jpg`,
  uxBanner4: `${CDN}/banner4.jpg`,
  uxH5Thumbnail: `${CDN}/h5-thumbnail.png`,
  uxH5Detail: `${CDN}/H5-detail.jpg`,
  uxKtDetail: `${CDN}/kt板-detail.jpg`,
  uxKtThumbnail: `${CDN}/kt板-thumbnail.jpg`,
  uxNourishScene: `${CDN}/nourish-scene.jpg`,
  uxNourishTopBg: `${CDN}/nourish-top-bg.jpg`,
  uxPriceTag: `${CDN}/price-tag.jpg`,
  uxPrompt9: `${CDN}/prompt9.png`,
  uxPrompt10: `${CDN}/prompt10.png`,
  xhsPrompt11: `${CDN}/prompt11.png`,
  uxPsEdit: `${CDN}/ps-edit.jpg`,
  uxStandee: `${CDN}/standee.jpg`,
  uxStoreScene: `${CDN}/store-scene.jpg`,
  uxStyleA: `${CDN}/styleA.png`,
  uxStyleB: `${CDN}/styleB.png`,
  uxStyleC: `${CDN}/styleC.png`,
  uxDefault1: `${CDN}/default1.png`,
  uxCharacter: `${CDN}/character.png`,
  uxIconBanner: `${CDN}/icon-banner.png`,
  uxIconDemand: `${CDN}/icon-demand.png`,
  uxIconHome: `${CDN}/icon-home.png`,
  uxIconNoticeL: `${CDN}/icon-notice-L.png`,
  uxIconNotice: `${CDN}/icon-notice.png`,
  uxIconOlder: `${CDN}/icon-older.png`,
  uxIconPeople: `${CDN}/icon-people.png`,
  uxIconPhoto: `${CDN}/icon-photo.png`,
  uxIconPolicy: `${CDN}/icon-policy.png`,
  uxIconStyle: `${CDN}/icon-style.png`,
  uxIconTrend: `${CDN}/icon-trend.png`,
  uxIconTarget: `${CDN}/icon-target.png`,
  homepage1: `${CDN}/%E4%B8%BB%E9%A1%B5%E5%9B%BE1.png`,
  homepage2: `${CDN}/%E4%B8%BB%E9%A1%B5%E5%9B%BE2.png`,
  scene1_1: `${CDN}/scene1-1.png`,
  scene1_2: `${CDN}/scene1-2.png`,
  scene2_1: `${CDN}/scene2-1.png`,
  scene2_2: `${CDN}/scene2-2.png`,
  scene3_1: `${CDN}/scene3-1.png`,
  scene3_2: `${CDN}/scene3-2.png`,
  scene4_1: `${CDN}/scene4-1.png`,
  scene4_2: `${CDN}/scene4-2.png`,
  product: `${CDN}/product.png`,
  product1: `${CDN}/product1.png`,
  product2: `${CDN}/product2.png`,
  product3: `${CDN}/product3.png`,
  product4: `${CDN}/product4.png`,
  product5: `${CDN}/product5.png`,
  product6: `${CDN}/product6.png`,
  product7: `${CDN}/product7.png`,
  card1: `${CDN}/card1.jpg`,
  card2: `${CDN}/card2.jpg`,
  card3: `${CDN}/card3.jpg`,
  share1: `${CDN}/share1.jpg`,
  share2: `${CDN}/share2.jpg`,
  share3: `${CDN}/share3.jpg`,
  share4: `${CDN}/share4.jpg`,
  share5: `${CDN}/share5.jpg`,
  share6: `${CDN}/share6.jpg`,
  empty1: `${CDN}/empty1.jpg`,
  empty2: `${CDN}/empty2.jpg`,
  empty3: `${CDN}/empty3.jpg`,
  smallFolder1: `${CDN}/small-folder1.png`,
  smallFolder2: `${CDN}/small-folder2.png`,
  smallFolder2Front: `${CDN}/small-folder2-front.svg`,
  smallFolder2Back: `${CDN}/small-folder2-back.svg`,
  photoThumbnail1: `${CDN}/photo-thumbnail1.png`,
  photoThumbnail2: `${CDN}/photo-thumbnail2.png`,
  photoThumbnail3: `${CDN}/photo-thumbnail3.png`,
  waterfall1_1: `${CDN}/waterfall1-1.jpg`,
  waterfall1_2: `${CDN}/waterfall1-2.jpg`,
  waterfall1_3: `${CDN}/waterfall1-3.jpg`,
  waterfall1_4: `${CDN}/waterfall1-4.jpg`,
  waterfall2_1: `${CDN}/waterfall2-1.jpg`,
  waterfall2_2: `${CDN}/waterfall2-2.jpg`,
  waterfall2_3: `${CDN}/waterfall2-3.jpg`,
  waterfall2_4: `${CDN}/waterfall2-4.jpg`,
  waterfall3_1: `${CDN}/waterfall3-1.jpg`,
  waterfall3_2: `${CDN}/waterfall3-2.jpg`,
  waterfall3_3: `${CDN}/waterfall3-3.jpg`,
  waterfall3_4: `${CDN}/waterfall3-4.jpg`,
  waterfall4_1: `${CDN}/waterfall4-1.jpg`,
  waterfall4_2: `${CDN}/waterfall4-2.jpg`,
  waterfall4_3: `${CDN}/waterfall4-3.jpg`,
  waterfall4_4: `${CDN}/waterfall4-4.jpg`,
  waterfall5_1: `${CDN}/waterfall5-1.jpg`,
  waterfall5_2: `${CDN}/waterfall5-2.jpg`,
  waterfall5_3: `${CDN}/waterfall5-3.jpg`,
  waterfall5_4: `${CDN}/waterfall5-4.jpg`,
  waterfall5_5: `${CDN}/waterfall5-5.jpg`,
  waterfall6_1: `${CDN}/waterfall6-1.jpg`,
  waterfall6_2: `${CDN}/waterfall6-2.jpg`,
  waterfall6_3: `${CDN}/waterfall6-3.jpg`,
  waterfall6_4: `${CDN}/waterfall6-4.jpg`,
  waterfall6_5: `${CDN}/waterfall6-5.jpg`,
  waterfall7_1: `${CDN}/waterfall7-1.jpg`,
  waterfall7_2: `${CDN}/waterfall7-2.jpg`,
  waterfall7_3: `${CDN}/waterfall7-3.jpg`,
  waterfall7_4: `${CDN}/waterfall7-4.jpg`,
  waterfall7_5: `${CDN}/waterfall7-5.jpg`,
  window: `${CDN}/window.png`,
  posterTopBg: `${CDN}/poster-top-bg.jpg`,
  xhsTopBg: `${CDN}/xhs-top-bg.jpg`,
  watermelon1_1: `${CDN}/watermelon1-1.jpg`,
  watermelon1_2: `${CDN}/watermelon1-2.jpg`,
  watermelon1_3: `${CDN}/watermelon1-3.jpg`,
  watermelonScene1: `${CDN}/watermelon%20scene1.jpg`,
  watermelonScene2: `${CDN}/watermelon%20scene2.jpg`,
  watermelonScene3: `${CDN}/watermelon%20scene3.jpg`,
  watermelonScene4: `${CDN}/watermelon%20scene4.jpg`,
  watermelonScene5: `${CDN}/watermelon%20scene5.jpg`,
  slotmachine1: `${CDN}/slotmachine1.jpg`,
  slotmachine2: `${CDN}/slotmachine2.jpg`,
  prompt1: `${CDN}/prompt1.jpg`,
  prompt2: `${CDN}/prompt2.jpg`,
  prompt3: `${CDN}/prompt3.jpg`,
  posterFlower1: `${CDN}/flower1.jpg`,
  posterFlower2: `${CDN}/flower2.jpg`,
  posterCitywalk: `${CDN}/citywalk.jpg`,
  posterCoffee: `${CDN}/coffee.jpg`,
  posterDonatebook: `${CDN}/donatebook.jpg`,
  posterFishing: `${CDN}/fishing.jpg`,
  posterFoodmap: `${CDN}/foodmap.jpg`,
  posterMusic: `${CDN}/music.jpg`,
  watermelonGif: `${CDN}/watermelon.webp`,
  colaGif: `${CDN}/cola.webp`,
  chairGif: `${CDN}/chair.webp`,
  flowerGif: `${CDN}/flower.webp`,
  cityFoodGif: `${CDN}/city-food.webp`,
  arrow4: `${CDN}/arrow4.svg`,
  arrow5: `${CDN}/arrow5.svg`,
  arrow6: `${CDN}/arrow6.svg`,
  wordCloud: `${CDN}/word-cloud.png`,
  peopleMotion: `${CDN}/people-motion.gif`,
};

const navItems = ['首页', '关于我', 'AI/运营', 'UX/UI', '个人探索', '联系我'];

const pageMap = [
  { id: 'home', frameName: 'home' },
  { id: 'about', frameName: '关于我' },
  { id: 'about-ai', frameName: '转场“关于我-AI/运营”' },
  { id: 'ai-ux', frameName: '转场“AI/运营-UX/UI项目”' },
  { id: 'ux-explore', frameName: '转场“UX/UI项目-个人探索”' },
  { id: 'explore', frameName: '个人探索' },
  { id: 'explore-contact', frameName: '转场“个人探索-联系我”' },
];

function useCanvasScale() {
  return 1;
}

function px(value) {
  return `${value}px`;
}

function computerTweenVars({ left, top, width, height }) {
  const base = { left: 295, top: 153, width: 684, height: 484 };

  return rectTweenVars({ left, top, width, height }, base);
}

function rectTweenVars({ left, top, width, height }, base) {
  return {
    x: left - base.left + (width - base.width) / 2,
    y: top - base.top + (height - base.height) / 2,
    scaleX: width / base.width,
    scaleY: height / base.height,
  };
}

function Layer({ name, className = '', style, children, as: Tag = 'div', ...props }) {
  return (
    <Tag className={`layer ${name} ${className}`} style={style} data-layer={name} {...props}>
      {children}
    </Tag>
  );
}

function ImageLayer({ name, src, className = '', style, alt, ...props }) {
  return (
    <img
      className={`layer image-layer ${name} ${className}`}
      style={style}
      src={src}
      alt={alt || name}
      data-layer={name}
      draggable="false"
      {...props}
    />
  );
}

function TextLayer({ name, children, style, className = '' }) {
  return (
    <div className={`layer text-layer ${name} ${className}`} style={style} data-layer={name}>
      {children}
    </div>
  );
}

function DesignFrame({ frameName, id, children }) {
  const scale = useCanvasScale();

  return (
    <section className="frame-shell" id={id} data-frame={frameName} style={{ height: px(717 * scale) }}>
      <div className="figma-frame" style={{ transform: `translateX(-50%) scale(${scale})` }}>
        {children}
      </div>
    </section>
  );
}

function TopNavigation() {
  return (
    <>
      <TextLayer name="name" style={{ left: 40, top: 34, fontSize: 18, lineHeight: '18px' }}>
        YUYIMIAO
      </TextLayer>
      <Layer name="navigation">
        <Layer name="menu">
          {['首页', '关于我', 'AI/运营', 'UX/UI项目', '个人探索', '联系我'].map((item) => (
            <a key={item} href={`#${targetForNav(item === 'UX/UI项目' ? 'UX/UI' : item)}`}>
              {item}
            </a>
          ))}
        </Layer>
        <span className="language">
          <strong>中</strong>/EN
        </span>
      </Layer>
    </>
  );
}

function ButtonFrame({ name, label, left }) {
  return (
    <a className={`layer figma-button ${name}`} style={{ left, top: 424 }} href={name.includes('contact') ? '#explore-contact' : '#'}>
      {label}
    </a>
  );
}

function FullComputer({ variant = 'home', style, showKeyboard = true }) {
  return (
    <Layer name="full-computer" className={`full-computer ${variant}`} style={style}>
      <Layer name="screen" className="screen-shape" />
      <ImageLayer name="computer-screen" src={assets.computerScreen} />
      {showKeyboard ? <ImageLayer name="keyboard" src={assets.keyboard} /> : null}
    </Layer>
  );
}

function HomeComputer() {
  return (
    <div className="home-about-transition-layer">
      <div className="home-about-transition-stage" style={{ marginLeft: 0, transform: 'translateX(-50%)' }}>
        <FullComputer variant="home" />
        <TextLayer name="title-关于我" className="section-title home-about-title" style={{ left: 430, top: 307, width: 420 }}>
          关于我
        </TextLayer>
        <div className="home-about-overlay-content">
          <TextLayer name="welcome" style={{ left: 403, top: 256, fontSize: 60, lineHeight: '60px' }}>
            welcome
          </TextLayer>
          <TextLayer name="My Channel" style={{ left: 403, top: 320, fontSize: 95, lineHeight: '95px' }}>
            My Channel
          </TextLayer>
          <ButtonFrame name="button-download" label="下载简历" left={411} />
          <ButtonFrame name="button-contact" label="联系我" left={672} />
        </div>
      </div>
    </div>
  );
}

function OnlyHomeFrame() {
  const scale = useCanvasScale();

  return (
    <div className="onlyhome-group" data-frame="onlyhome">
      <div className="home-about-fixed-stage" style={{ transform: `translateX(-50%) scale(${scale})` }}>
        <Layer name="bg-home">
          <ImageLayer name="BG" src={assets.bgHome} />
        </Layer>
        <ImageLayer name="BG-rectangle" src={assets.bgRectangle} style={{ left: 0, top: 0, width: 1280, height: 720 }} />
        <TopNavigation />
      </div>
    </div>
  );
}

function LeftNavigation({ active, className = '' }) {
  return (
    <nav className={`layer left-navigation ${className}`} data-layer="left-navigation" aria-label="左侧页面导航">
      <div className="left-navigation-hove">
        <div className="left-navigation-rectangle-hover" />
        {navItems.map((item) => (
          <a className={active === item ? 'active' : ''} key={item} href={`#${targetForNav(item)}`}>
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}

function targetForNav(item) {
  if (item === '首页') return 'home';
  if (item === '关于我') return 'about';
  if (item === 'AI/运营') return 'about-ai';
  if (item === 'UX/UI') return 'ai-ux';
  if (item === '个人探索') return 'explore';
  return 'explore-contact';
}

function ArrowHint({ name, label, x, y, arrowX = 0, arrowY = 16, flip = false }) {
  const arrowSrc = name === 'arrow1' ? assets.arrow1 : name === 'arrow2' ? assets.arrow2 : name === 'arrow3' ? assets.arrow3 : null;
  const arrowSize = name === 'arrow2' ? { width: 94, height: 37.28 } : { width: 67, height: 22 };

  return (
    <Layer name={name} className="click-hint" style={{ left: x, top: y }}>
      <span>{label}</span>
      {arrowSrc ? (
        <img
          className={`click-hint-arrow ${flip ? 'flip' : ''}`}
          style={{ left: arrowX, top: arrowY }}
          src={arrowSrc}
          alt={name}
          width={arrowSize.width}
          height={arrowSize.height}
          draggable="false"
        />
      ) : (
        <svg className={flip ? 'flip' : ''} width="94" height="38" viewBox="0 0 94 38" fill="none" aria-hidden="true">
          <path d="M1 23C18 8 36 2 55 6C71 9 81 19 89 34" stroke="#283f51" strokeDasharray="2 3" />
          <path d="M78 33H90V21" stroke="#283f51" strokeDasharray="2 3" />
        </svg>
      )}
    </Layer>
  );
}

function Home() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return undefined;

    const ctx = gsap.context(() => {
      const fullComputer = stage.querySelector('.full-computer.home');
      const homeBackground = stage.querySelector('.onlyhome-group');
      const homeCopy = stage.querySelectorAll('.welcome, .My.Channel, .button-download, .button-contact');
      const aboutTitle = stage.querySelector('.home-about-title');
      const leftNavigation = stage.querySelector('.home-about-left-navigation');
      const screen = stage.querySelector('.screen-shape');
      const keyboard = stage.querySelector('.keyboard');

      gsap.set(fullComputer, { transformOrigin: 'center center', x: 0, y: 0, scaleX: 1, scaleY: 1 });
      gsap.set([aboutTitle, leftNavigation], { autoAlpha: 0 });
      gsap.set([homeBackground, homeCopy, screen, keyboard], { autoAlpha: 1 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=1000',
          scrub: 1,
          snap: {
            snapTo: [0, 1],
            directional: false,
            inertia: false,
            delay: 0.3,
            duration: { min: 0.25, max: 0.7 },
            ease: 'power2.inOut',
          },
          pin: stage,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });

      tl.to(homeBackground, { autoAlpha: 0, duration: 0.25 }, 0)
        .to(homeCopy, { autoAlpha: 0, duration: 0.5 }, 0)
        .to(fullComputer, { ...computerTweenVars({ left: 180, top: 72, width: 912, height: 645 }), duration: 0.25 }, 0)
        .to(fullComputer, { ...computerTweenVars({ left: 98, top: 14, width: 1076, height: 761 }), duration: 0.25 }, 0.25)
        .to(fullComputer, { ...computerTweenVars({ left: -7, top: -60, width: 1287, height: 909 }), duration: 0.25 }, 0.5)
        .to(fullComputer, { ...computerTweenVars({ left: -127, top: -36, width: 1517, height: 978 }), duration: 0.25 }, 0.75)
        .to(aboutTitle, { autoAlpha: 1, duration: 0.25 }, 0.75)
        .set([screen, keyboard], { autoAlpha: 0 }, 0.99)
        .set(leftNavigation, { autoAlpha: 1 }, 0.99);
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="home-about-scroll-section frame-shell" id="home" data-frame="home">
      <div ref={stageRef} className="home-about-pin-viewport">
        <div className="figma-frame home-about-animation-stage">
          <OnlyHomeFrame />
          <HomeComputer />
          <LeftNavigation active="关于我" className="home-about-left-navigation" />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <DesignFrame id="about" frameName="关于我">
      <ImageLayer name="computer-screen" className="about-computer-screen" src={assets.computerScreen} />
      <TextLayer name="title-关于我" className="section-title" style={{ left: 430, top: 307, width: 420 }}>
        关于我
      </TextLayer>
      <LeftNavigation active="关于我" />
    </DesignFrame>
  );
}

function DeskObjectLayers({ onOpenProject, onOpenFolder }) {
  return (
    <>
      <Layer name="ai-computer" className="mask-group" style={{ left: 0, top: 0, width: 385, height: 412 }}>
        <ImageLayer name="ai-computer" src={assets.aiComputer} style={{ left: 0, top: 0, width: 385, height: 412 }} />
      </Layer>
      <Layer name="notebook" className="mask-group" style={{ left: 0, top: 554, width: 247, height: 163 }}>
        <ImageLayer name="notebook" src={assets.notebook} style={{ left: 0, top: 0, width: 247, height: 163 }} />
      </Layer>
      <ImageLayer name="pen-cup" src={assets.penCup} style={{ left: 1157, top: 184, width: 123, height: 255 }} />
      <ImageLayer
        name="folder"
        src={assets.folder}
        style={{ left: 834, top: 410, width: 446, height: 307, cursor: 'pointer' }}
        onClick={onOpenFolder}
        role="button"
        tabIndex={0}
        aria-label="打开AI/运营2-2"
      />
      <ImageLayer name="coffee" src={assets.coffee} style={{ left: 938, top: 0, width: 302, height: 238 }} />
      <ImageLayer name="leave" src={assets.leave} style={{ left: 396, top: 0, width: 223, height: 177 }} />
      <Layer
        name="iphone+paper"
        className="project-open-group"
        style={{ left: 72, top: 380, width: 324, height: 310 }}
        as="button"
        type="button"
        onClick={onOpenProject}
        aria-label="打开AI/运营2-1"
      >
        <ImageLayer name="iphone" src={assets.iphone} style={{ left: 0, top: 0, width: 213, height: 310, zIndex: 2 }} />
        <ImageLayer name="paper" src={assets.paper} style={{ left: 129, top: 32, width: 195, height: 218, zIndex: 1 }} />
      </Layer>
    </>
  );
}

function AboutTailTemporaryContent() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="about-tail-temporary-content" data-layer="about-tail-temporary-content">
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="about-word-cloud-turbulence" x="-10%" y="-15%" width="120%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.022" numOctaves="2" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <ImageLayer name="people-motion" src={playing ? assets.peopleMotion : peopleMotionStill} style={{ left: 22, top: 31, width: 560, height: 560, pointerEvents: 'auto' }} onMouseEnter={() => setPlaying(true)} onMouseLeave={() => setPlaying(false)} />
      <ImageLayer name="word-cloud" src={assets.wordCloud} style={{ left: 281, top: 65, width: 357, height: 193, filter: 'url(#about-word-cloud-turbulence)' }} />
      <Layer name="detail" className="about-frame-detail" style={{ left: 648, top: -262, width: 545, height: 957 }}>
        <Layer name="introduction" className="about-detail-section" style={{ left: 0, top: 0, width: 530, height: 81 }}>
          <TextLayer name="introduction" style={{ left: 0, top: 0, width: 530, minHeight: 81, fontSize: 18, fontWeight: 600, lineHeight: '27px', textAlign: 'justify' }}>3年+产品运营经验，擅长用户洞察与产品内容策划执行，通过数据驱动与AB测试推动体验优化与增长，具备视觉设计与内容生产能力，可快速迁移至品牌内容策划与新媒体运营方向。</TextLayer>
        </Layer>
        <Layer name="work" className="about-detail-section" style={{ left: 0, top: 127, width: 530, height: 206 }}>
          <TextLayer name="中国联通温州市分公司" style={{ left: 0, top: 52, width: 180, minHeight: 18, fontSize: 18, fontWeight: 600, lineHeight: '18px', textAlign: 'left' }}>中国联通温州市分公司</TextLayer>
          <TextLayer name="产品运营/交互设计" style={{ left: 221, top: 52, width: 151, minHeight: 18, fontSize: 18, fontWeight: 600, lineHeight: '18px', textAlign: 'left' }}>产品运营/交互设计</TextLayer>
          <TextLayer name="2023.01-至今" style={{ left: 417, top: 52, width: 113, minHeight: 18, fontSize: 18, fontWeight: 600, lineHeight: '18px', textAlign: 'left' }}>2023.01-至今</TextLayer>
          <TextLayer name="工作经历" style={{ left: 0, top: 0, width: 112, minHeight: 28, fontSize: 28, fontWeight: 700, lineHeight: '28px', textAlign: 'left' }}>工作经历</TextLayer>
          <TextLayer name="负责公司toG/toB项目如「互联网+养老项目」、「秋开校园促销H5」等产品运营及交互设计；主导产品转化提升、视觉设计改版、结合用户需求优化页面体验，能结合AI工具规范工作流提升效率；同时负责其他内部业务需求的相关设计支援，如部门宣传片策划、运营图设计、展会驾驶舱、产品图主视觉等内容。" style={{ left: 0, top: 86, width: 530, minHeight: 120, fontSize: 16, fontWeight: 400, lineHeight: '24px', textAlign: 'justify' }}>负责公司toG/toB项目如「互联网+养老项目」、「秋开校园促销H5」等产品运营及交互设计；主导产品转化提升、视觉设计改版、结合用户需求优化页面体验，能结合AI工具规范工作流提升效率；同时负责其他内部业务需求的相关设计支援，如部门宣传片策划、运营图设计、展会驾驶舱、产品图主视觉等内容。</TextLayer>
        </Layer>
        <Layer name="education" className="about-detail-section" style={{ left: 0, top: 379, width: 530, height: 176 }}>
          <TextLayer name="北京林业大学  艺术设计学院 / 交互设计" style={{ left: 0, top: 52, width: 312, minHeight: 18, fontSize: 18, fontWeight: 600, lineHeight: '18px', textAlign: 'left' }}>北京林业大学  艺术设计学院 / 交互设计</TextLayer>
          <TextLayer name="西华大学      机械工程学院 / 工业设计" style={{ left: 0, top: 126, width: 292, minHeight: 18, fontSize: 18, fontWeight: 600, lineHeight: '18px', textAlign: 'left' }}>西华大学      机械工程学院 / 工业设计</TextLayer>
          <TextLayer name="硕士    CET6、校优秀学生干部等" style={{ left: 0, top: 86, width: 224, minHeight: 16, fontSize: 16, fontWeight: 400, lineHeight: '16px', textAlign: 'left' }}>硕士    CET6、校优秀学生干部等</TextLayer>
          <TextLayer name="2019.09—2022.06" style={{ left: 369, top: 52, width: 161, minHeight: 18, fontSize: 18, fontWeight: 600, lineHeight: '18px', textAlign: 'left' }}>2019.09—2022.06</TextLayer>
          <TextLayer name="学士    GPA：3.56（1/87）" style={{ left: 0, top: 160, width: 191, minHeight: 16, fontSize: 16, fontWeight: 400, lineHeight: '16px', textAlign: 'left' }}>学士    GPA：3.56（1/87）</TextLayer>
          <TextLayer name="2015.09—2019.06" style={{ left: 372, top: 126, width: 158, minHeight: 18, fontSize: 18, fontWeight: 600, lineHeight: '18px', textAlign: 'left' }}>2015.09—2019.06</TextLayer>
          <TextLayer name="教育经历" style={{ left: 0, top: 0, width: 112, minHeight: 28, fontSize: 28, fontWeight: 700, lineHeight: '28px', textAlign: 'left' }}>教育经历</TextLayer>
        </Layer>
        <Layer name="skill" className="about-detail-section" style={{ left: 0, top: 601, width: 545, height: 70 }}>
          <TextLayer name="界面设计/网页设计/需求调研/活动运营与策划/品牌设计/运营图设计..." style={{ left: 0, top: 52, width: 545, minHeight: 18, fontSize: 18, fontWeight: 400, lineHeight: '18px', textAlign: 'left' }}>界面设计/网页设计/需求调研/活动运营与策划/品牌设计/运营图设计...</TextLayer>
          <TextLayer name="技能" style={{ left: 0, top: 0, width: 56, minHeight: 28, fontSize: 28, fontWeight: 700, lineHeight: '28px', textAlign: 'left' }}>技能</TextLayer>
        </Layer>
        <Layer name="software" className="about-detail-section" style={{ left: 1, top: 717, width: 512, height: 168 }}>
          <TextLayer name="软件" style={{ left: 0, top: 0, width: 56, minHeight: 28, fontSize: 28, fontWeight: 700, lineHeight: '28px', textAlign: 'left' }}>软件</TextLayer>
          <ImageLayer name="capcut" src={`${CDN}/capcut.png`} style={{ left: 396, top: 52, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="axure" src={`${CDN}/axure.png`} style={{ left: 330, top: 52, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="ai" src={`${CDN}/ai.png`} style={{ left: 198, top: 52, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="ps" src={`${CDN}/ps.png`} style={{ left: 132, top: 52, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="figma" src={`${CDN}/figma.png`} style={{ left: 0, top: 52, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="sketch" src={`${CDN}/sketch.png`} style={{ left: 66, top: 52, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="mock" src={`${CDN}/mock.png`} style={{ left: 264, top: 52, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="teambition" src={`${CDN}/teambition.png`} style={{ left: 462, top: 52, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="jimeng" src={`${CDN}/jimeng.png`} style={{ left: 198, top: 118, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="doubao" src={`${CDN}/doubao.png`} style={{ left: 264, top: 118, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="mj" src={`${CDN}/mj.png`} style={{ left: 132, top: 118, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="gpt" src={`${CDN}/gpt.png`} style={{ left: 0, top: 118, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="deepseek" src={`${CDN}/deepseek.png`} style={{ left: 330, top: 118, width: 50, height: 50, borderRadius: '50%' }} />
          <ImageLayer name="lovart" src={`${CDN}/lovart.png`} style={{ left: 66, top: 118, width: 50, height: 50, borderRadius: '50%' }} />
        </Layer>
      </Layer>
    </div>
  );
}

function TransitionAboutAi({ onOpenProject, onOpenFolder, onOpenUxUiSecond, onOpenExploreSecond, onOpenExploreWaterfall }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return undefined;

    const ctx = gsap.context(() => {
      const fullComputer = stage.querySelector('.full-computer.about-ai-transition');
      const temporaryContent = stage.querySelector('.about-tail-temporary-content');
      const aboutTitle = stage.querySelector('.about-internal-title');
      const people = temporaryContent.querySelector('.people-motion');
      const wordCloud = temporaryContent.querySelector('.word-cloud');
      const detail = temporaryContent.querySelector('.about-frame-detail');
      const detailSections = detail.querySelectorAll('.about-detail-section');
      const turbulence = temporaryContent.querySelector('feTurbulence');
      const displacement = temporaryContent.querySelector('feDisplacementMap');
      const objectLayer = stage.querySelector('.about-ai-object-layer');
      const objects = objectLayer.querySelectorAll(':scope > .ai-computer, :scope > .notebook, :scope > .pen-cup, :scope > .folder, :scope > .coffee, :scope > .leave, :scope > .project-open-group');
      const titleAi = stage.querySelector('.title-ai');
      const titleUx = stage.querySelector('.title-ux\\/ui');
      const hints = stage.querySelectorAll('.more-label, .image-button, .arrow2');
      const uxProjects = stage.querySelectorAll('.project1, .project2');
      const uxHint = stage.querySelector('.click-hint');
      const uxWindow = stage.querySelector('.browser-window-frame');
      const screen = stage.querySelector('.screen-shape');
      const keyboard = stage.querySelector('.keyboard');
      const aboutNavigation = stage.querySelector('.about-tail-left-navigation');
      const aiNavigation = stage.querySelector('.about-ai-left-navigation');
      const uxNavigation = stage.querySelector('.about-ai-ux-left-navigation');
      const exploreNavigation = stage.querySelector('.about-ai-explore-left-navigation');
      const contactNavigation = stage.querySelector('.about-ai-contact-left-navigation');
      const contactCard = stage.querySelector('.contact-card');
      const baseComputer = { left: -127, top: -36, width: 1517, height: 978 };
      const targetComputer = { left: -225, top: -94, width: 1730, height: 1115 };
      const contactComputer = { left: 98, top: 41, width: 1065, height: 767 };
      const objectOffsets = [
        [objectLayer.querySelector(':scope > .ai-computer'), -323, -412, 0, 0],
        [objectLayer.querySelector(':scope > .notebook'), -247, 804, 0, 554],
        [objectLayer.querySelector(':scope > .pen-cup'), 1632, -54, 1157, 184],
        [objectLayer.querySelector(':scope > .folder'), 1123, 803, 834, 410],
        [objectLayer.querySelector(':scope > .coffee'), 972, -354, 938, 0],
        [objectLayer.querySelector(':scope > .leave'), 375, -412, 396, 0],
        [objectLayer.querySelector(':scope > .project-open-group'), 43, 800, 72, 380],
      ];
      const outgoingObjectOffsets = [
        [objectLayer.querySelector(':scope > .ai-computer'), -323, -412, 0, 0],
        [objectLayer.querySelector(':scope > .notebook'), -247, 804, 0, 554],
        [objectLayer.querySelector(':scope > .pen-cup'), 1632, -54, 1157, 184],
        [objectLayer.querySelector(':scope > .folder'), 1123, 803, 834, 410],
        [objectLayer.querySelector(':scope > .coffee'), 972, -354, 938, 0],
        [objectLayer.querySelector(':scope > .leave'), 375, -412, 396, 0],
        [objectLayer.querySelector(':scope > .project-open-group'), 43, 800, 72, 380],
      ];

      gsap.set(fullComputer, { transformOrigin: 'center center', x: 0, y: 0, scaleX: 1, scaleY: 1 });
      gsap.set(temporaryContent, { autoAlpha: 1 });
      gsap.set(aboutTitle, { autoAlpha: 1, y: 0 });
      gsap.set([people, wordCloud], { autoAlpha: 0, y: 144 });
      gsap.set(detail, { y: 437 });
      gsap.set(detailSections, { autoAlpha: 0 });
      gsap.set(objects, { autoAlpha: 0 });
      gsap.set(titleAi, { autoAlpha: 0, y: 452 });
      gsap.set(titleUx, { autoAlpha: 0, y: 159 });
      gsap.set(hints, { autoAlpha: 0 });
      gsap.set(uxProjects, { autoAlpha: 0, y: 0 });
      gsap.set(uxHint, { autoAlpha: 0 });
      gsap.set(uxWindow, { autoAlpha: 0, x: 0, y: 0, scaleX: 1, scaleY: 1, '--window-fade-radius': '-240px' });
      gsap.set(contactCard, { autoAlpha: 0 });
      gsap.set([screen, keyboard], { autoAlpha: 0 });
      gsap.set(aboutNavigation, { autoAlpha: 1 });
      gsap.set(aiNavigation, { autoAlpha: 0 });
      gsap.set(uxNavigation, { autoAlpha: 0 });
      gsap.set(exploreNavigation, { autoAlpha: 0 });
      gsap.set(contactNavigation, { autoAlpha: 0 });
      objectOffsets.forEach(([element, startLeft, startTop, endLeft, endTop]) => {
        if (!element) return;
        gsap.set(element, { x: startLeft - endLeft, y: startTop - endTop });
      });

      const wordMotion = gsap.timeline({ paused: true, repeat: -1, yoyo: true })
        .to(turbulence, { attr: { baseFrequency: '0.018 0.03' }, duration: 3, ease: 'sine.inOut' }, 0)
        .to(displacement, { attr: { scale: 12 }, duration: 3, ease: 'sine.inOut' }, 0);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const updateStage = (self) => {
        const active = self.scroll() >= self.start;
        gsap.set(section, { clipPath: active ? 'none' : 'inset(0 0 100% 0)' });
        const wordVisible = active && Number(gsap.getProperty(wordCloud, 'opacity')) > 0 && Number(gsap.getProperty(temporaryContent, 'opacity')) > 0;
        if (wordVisible && !reducedMotion) wordMotion.resume();
        else wordMotion.pause();
      };
      const master = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => {
          if (master.scrollTrigger) updateStage(master.scrollTrigger);
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=6700',
          scrub: 1,
          snap: {
            snapTo: 'labels',
            directional: false,
            inertia: false,
            delay: 0.3,
            duration: { min: 0.25, max: 0.7 },
            ease: 'power2.inOut',
          },
          pin: stage,
          pinSpacing: false,
          invalidateOnRefresh: true,
          onUpdate: updateStage,
          onRefresh: updateStage,
        },
      });

      const aboutReveal = gsap.timeline({ defaults: { ease: 'none' } })
        .to(aboutTitle, { y: -444, duration: 0.6 }, 0)
        .to(aboutTitle, { autoAlpha: 0, duration: 0.45 }, 0.15)
        .to(wordCloud, { y: 0, autoAlpha: 1, duration: 0.25 }, 0.6)
        .to(people, { y: 0, autoAlpha: 1, duration: 0.25 }, 0.8)
        .to(detail, { y: 0, duration: 0.55 }, 1.05)
        .to(detailSections, { autoAlpha: 1, duration: 0.15, stagger: 0.1 }, 1.05);
      const tl = gsap.timeline({ defaults: { ease: 'none' } });

      tl.to(temporaryContent, { autoAlpha: 0, duration: 0.15 }, 0.1)
        .to([screen, keyboard], { opacity: 0, duration: 1 }, 0)
        .to(fullComputer, { ...rectTweenVars(targetComputer, baseComputer), duration: 0.15 }, 0.1)
        .set(objects, { autoAlpha: 1 }, 0.25)
        .to(objects, { x: 0, y: 0, duration: 0.75 }, 0.25)
        .to(titleAi, { autoAlpha: 1, duration: 0.5 }, 0.5)
        .to(titleAi, { y: 0, duration: 0.25 }, 0.75)
        .to(hints, { autoAlpha: 1, duration: 0.25 }, 0.75)
        .set([screen, keyboard], { opacity: 0, visibility: 'hidden' }, 0.95)
        .set(aboutNavigation, { autoAlpha: 0 }, 0.95)
        .set(aiNavigation, { autoAlpha: 1 }, 0.95);

      outgoingObjectOffsets.forEach(([element, outLeft, outTop, baseLeft, baseTop]) => {
        if (!element) return;
        tl.to(element, { x: outLeft - baseLeft, y: outTop - baseTop, duration: 0.2 }, 1.3);
      });

      tl.to(hints, { autoAlpha: 0, duration: 0.2 }, 1.3)
        .to(titleAi, { autoAlpha: 0, y: -155, duration: 0.3 }, 1.3)
        .to(objects, { autoAlpha: 0, duration: 0.05 }, 1.45)
        .set(objects, { visibility: 'hidden' }, 1.5)
        .to(titleUx, { autoAlpha: 1, y: 0, duration: 0.3 }, 1.7)
        .set(aiNavigation, { autoAlpha: 0 }, 1.95)
        .set(uxNavigation, { autoAlpha: 1 }, 1.95)
        .to(titleUx, { y: -339, autoAlpha: 0, duration: 0.6 }, 2)
        .to(uxProjects, { y: -92, autoAlpha: 1, duration: 0.3 }, 2.6)
        .to(uxHint, { autoAlpha: 1, duration: 0.15 }, 2.9)
        .to(uxWindow, { y: -102, autoAlpha: 1, duration: 0.15 }, 2.95)
        .to(uxProjects, { autoAlpha: 0, duration: 0.2 }, 3.4)
        .to(uxHint, { autoAlpha: 0, duration: 0.2 }, 3.4)
        .to(uxWindow, { x: -763, y: -697, duration: 0.7 }, 3.4)
        .set(uxProjects, { visibility: 'hidden' }, 3.6)
        .set(uxHint, { visibility: 'hidden' }, 3.6)
        .set(uxNavigation, { autoAlpha: 0 }, 4.05)
        .set(exploreNavigation, { autoAlpha: 1 }, 4.05)
        .to(uxWindow, { '--window-fade-radius': '1600px', duration: 0.2 }, 4.3)
        .set(uxWindow, { autoAlpha: 0 }, 4.5)
        .set([screen, keyboard], { visibility: 'visible' }, 4.5)
        .to([screen, keyboard], { opacity: 1, duration: 0.4 }, 4.5)
        .to(fullComputer, { ...rectTweenVars(contactComputer, baseComputer), duration: 0.4 }, 4.5)
        .set(exploreNavigation, { autoAlpha: 0 }, 4.9)
        .set(contactNavigation, { autoAlpha: 1 }, 4.9)
        .to(contactCard, { autoAlpha: 1, duration: 0.2 }, 4.9);

      master.add(aboutReveal, 0).add(tl, 1.6);
      master.addLabel('about-first-screen', 0)
        .addLabel('about-reveal-complete', 1.6)
        .addLabel('ai-first-screen', 2.6)
        .addLabel('ux-first-screen', 3.6)
        .addLabel('ux-reveal-complete', 4.7)
        .addLabel('explore-first-screen', 5.7)
        .addLabel('contact-first-screen', 6.7);
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-ai-scroll-section frame-shell" data-frame="转场“关于我-AI/运营”">
      <div id="about-ai" className="about-ai-anchor" aria-hidden="true" />
      <div id="ai-ux" className="about-ai-ux-anchor" aria-hidden="true" />
      <div id="explore" className="about-ai-explore-anchor" aria-hidden="true" />
      <div id="explore-contact" className="about-ai-contact-anchor" aria-hidden="true" />
      <div ref={stageRef} className="about-ai-pin-viewport">
        <div className="figma-frame about-ai-transition-stage">
          <FullComputer variant="about-ai-transition" style={{ left: -127, top: -36, width: 1517, height: 978 }} />
          <AboutTailTemporaryContent />
          <TextLayer name="title-关于我" className="section-title about-internal-title" style={{ left: 430, top: 307, width: 420 }}>关于我</TextLayer>
          <div className="about-ai-object-layer">
            <DeskObjectLayers onOpenProject={onOpenProject} onOpenFolder={onOpenFolder} />
          </div>
          <TextLayer name="title-ai" className="section-title" style={{ left: 395, top: 309, width: 490 }}>
            AI/运营
          </TextLayer>
          <TextLayer name="title-ux/ui" className="section-title" style={{ left: 290, top: 309, width: 700 }}>
            UX/UI项目
          </TextLayer>
          <BrowserWindowFrame style={{ left: 795, top: 733 }}>
            <TextLayer name="title-个人探索" className="window-title" style={{ left: 329, top: 136 }}>
              个人探索
            </TextLayer>
            <Folder name="small-folder1" style={{ left: 329, top: 242 }} label="账号笔记" onClick={onOpenExploreSecond} />
            <Folder name="small-folder2" style={{ left: 580, top: 242 }} label="摄影随拍" onClick={onOpenExploreWaterfall} interactiveOpen />
          </BrowserWindowFrame>
          <Layer name="project1" className="ux-explore-project project1" style={{ left: 95, top: 148 }} onClick={onOpenUxUiSecond} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onOpenUxUiSecond?.(); }}>
            <ImageLayer name="styleA" src={assets.uxStyleA} style={{ left: 12, top: 12, width: 328, height: 184 }} />
            <TextLayer name="颐养生活消费季" className="ux-explore-project-title" style={{ left: 16, top: 216 }}>颐养生活消费季</TextLayer>
          </Layer>
          <Layer name="project2" className="ux-explore-project project2" style={{ left: 464, top: 148 }}>
            <div className="ux-explore-project-default" />
            <ImageLayer name="default1" src={assets.uxDefault1} style={{ left: 95, top: 35, width: 150, height: 150 }} />
            <TextLayer name="项目更新中" className="ux-explore-project-title" style={{ left: 15, top: 216 }}>项目更新中...</TextLayer>
          </Layer>
          <ArrowHint name="arrow3" label="点击此处" x={879} y={583} arrowY={10} />
          <button
            type="button"
            className="layer more-label project-open-trigger"
            style={{ left: 231, top: 369 }}
            onClick={onOpenProject}
            data-layer="点击探索更多"
          >
            点击探索更多
          </button>
          <button
            type="button"
            className="layer image-button"
            style={{ left: 253, top: 384, width: 67, height: 22 }}
            onClick={onOpenProject}
            data-layer="arrow1-trigger"
            aria-label="打开AI/运营2-1"
          >
            <img src={assets.arrow1} alt="arrow1" draggable="false" />
          </button>
          <TextLayer name="点击探索更多" className="more-label" style={{ left: 1002, top: 445 }}>
            点击探索更多
          </TextLayer>
          <ImageLayer name="arrow2" src={assets.arrow2} style={{ left: 955, top: 455, width: 94, height: 37.28 }} />
          <Layer name="contact me" className="contact-card">
            <ImageLayer name="message" src={assets.message} />
            <TextLayer name="联系我" className="contact-title">联系我</TextLayer>
            <Layer name="mail" className="contact-line mail">
              <span>邮箱</span>
              <strong>monsters_y@163.com</strong>
            </Layer>
            <Layer name="tel" className="contact-line tel">
              <span>联系电话</span>
              <strong>13506516670</strong>
            </Layer>
            <div className="qr-code" data-layer="QR code" />
          </Layer>
          <LeftNavigation active="关于我" className="about-tail-left-navigation" />
          <LeftNavigation active="AI/运营" className="about-ai-left-navigation" />
          <LeftNavigation active="UX/UI" className="about-ai-ux-left-navigation" />
          <LeftNavigation active="个人探索" className="about-ai-explore-left-navigation" />
          <LeftNavigation active="联系我" className="about-ai-contact-left-navigation" />
        </div>
      </div>
    </section>
  );
}

function ModalImage({ name, src, className = '', style }) {
  return <img className={`modal-layer ${name} ${className}`} style={style} src={src} alt={name} draggable="false" data-layer={name} />;
}

function ModalText({ name, className = '', style, children }) {
  return (
    <div className={`modal-layer ${name} ${className}`} style={style} data-layer={name}>
      {children}
    </div>
  );
}

function ModalCanvas({ children }) {
  const scale = useCanvasScale();

  return (
    <div className="project-modal-canvas" style={{ height: px(717 * scale) }}>
      <div className="project-modal-frame" style={{ transform: `translateX(-50%) scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

function ProjectPaper({ name, className = '', index, stage, step, image, imageClass, topLayer = false, ...props }) {
  return (
    <div {...props} className={`modal-layer project-paper ${topLayer ? 'top-paper' : 'stack-paper'} ${className}`} data-layer={name}>
      <ModalImage name="paper" src={assets.paper2} className="project-paper-image" style={{ left: 0, top: 0, width: 518, height: 398 }} />
      <ModalText name={`${name}-index`} className="paper-index">{index}</ModalText>
      <ModalText name={`${name}-stage`} className="paper-stage">{stage}</ModalText>
      <ModalText name={`${name}-step`} className="paper-step">
        <span aria-hidden="true">›</span>
        {step}
      </ModalText>
      {image ? <img className={`paper-preview ${imageClass || ''}`} src={image} alt={name} draggable="false" /> : null}
    </div>
  );
}

function PainPointTwoPaper(props) {
  return (
    <div {...props} className="modal-layer project-paper stack-paper stack-card stack-card-1 pain-paper-two" data-layer="用户痛点2">
      <ModalImage name="paper" src={assets.paper2} className="project-paper-image" style={{ left: 0, top: 0, width: 518, height: 398 }} />
      <ModalText name="1" className="paper-index">1</ModalText>
      <ModalText name="产品分析" className="paper-stage">产品分析</ModalText>
      <ModalImage name="icon-right" src={assets.iconRight} className="pain-two-icon-right" style={{ left: 74, top: 61, width: 10, height: 14 }} />
      <ModalText name="STEP 1 用户痛点" className="pain-two-step">STEP 1&nbsp;&nbsp;用户痛点</ModalText>
      <ModalText name="pain-two-intro" className="pain-two-intro">
        场景还原：<br />
        •&nbsp;&nbsp;被种草网球，搜了一下发现球拍、球鞋、场地卡零零散散加起来要3000+，开始犹豫<br />
        •&nbsp;&nbsp;想起之前买的吉他、Kindle、健身卡都闲置了，自我怀疑“可能又会重蹈覆辙”<br />
        •&nbsp;&nbsp;最终放弃，甚至产生“我不配拥有爱好”的消极心理
      </ModalText>
      <div className="modal-layer pain-two-highlight" data-layer="痛点三提示条">
        <div className="pain-two-highlight-bar" />
        <div>痛点三：教程资源分散，存了很多都在收藏夹吃灰</div>
      </div>
      <ModalText name="pain-two-detail" className="pain-two-detail">
        用户原话：“网上教程太多了，收藏了很多不知道该跟哪个。”<br />
        场景还原：<br />
        •&nbsp;&nbsp;决定自学某项兴趣，打开B站/小红书搜索教程<br />
        •&nbsp;&nbsp;结果页出现几十甚至上百个视频<br />
        •&nbsp;&nbsp;花了大量时间筛选，还没开始学就已经疲惫
      </ModalText>
    </div>
  );
}

function AiOperationProjectCanvas() {
  return (
    <ModalCanvas>
      <ModalImage name="ai-computer" src={assets.aiComputer} style={{ left: -146, top: -226, width: 385, height: 412 }} />
      <ModalImage name="notebook" src={assets.notebook} style={{ left: -85, top: 541, width: 300, height: 203 }} />
      <div className="modal-layer vibe-coding" data-layer="vibe-coding">
        <ModalImage name="iphone" src={assets.iphone2} style={{ left: 190, top: 79, width: 284, height: 560 }} />
        <div className="modal-layer paper-deck" data-layer="paper-deck">
          <PaperStack>
          <ProjectPaper name="demo" className="stack-card stack-card-9" index="3" stage="高保真设计" step="STEP 2 DEMO制作" image={assets.demo} />
          <ProjectPaper name="设计风格" className="stack-card stack-card-8" index="3" stage="高保真设计" step="STEP 1 设计风格确定" image={assets.design} />
          <ProjectPaper name="线框图" className="stack-card stack-card-7" index="2" stage="原型设计" step="STEP 2 ASCII线框图" image={assets.wireframe} />
          <ProjectPaper name="PRD" className="stack-card stack-card-6" index="2" stage="原型设计" step="STEP 1 输出PRD文档" image={assets.prd} imageClass="prd-preview" />
          <ProjectPaper name="用户旅程" className="stack-card stack-card-5" index="1" stage="产品分析" step="STEP 4 用户旅程图" image={assets.userJourney} imageClass="journey-preview" />
          <ProjectPaper name="功能架构" className="stack-card stack-card-4" index="1" stage="产品分析" step="STEP 3 主要功能模块架构图" image={assets.chart} imageClass="chart-preview" />
          <ProjectPaper name="功能流程" className="stack-card stack-card-3" index="1" stage="产品分析" step="STEP 3 主要功能流程图" image={assets.flow} imageClass="flow-preview" />
          <ProjectPaper name="功能映射" className="stack-card stack-card-2" index="1" stage="产品分析" step="STEP 2 功能映射" image={assets.chart} imageClass="chart-preview" />
          <PainPointTwoPaper />
          <div className="modal-layer project-paper top-paper pain-paper" data-layer="用户痛点1">
            <ModalImage name="paper" src={assets.paper2} className="project-paper-image" style={{ left: 0, top: 0, width: 518, height: 398 }} />
            <ModalText name="1" className="paper-index">1</ModalText>
            <ModalText name="产品分析" className="paper-stage">产品分析</ModalText>
            <ModalText name="STEP 1 用户痛点" className="paper-step">
              <span aria-hidden="true">›</span>
              STEP 1&nbsp;&nbsp;用户痛点
            </ModalText>
            <div className="pain-block first">
              <div className="pain-heading">痛点一：不知道有什么可尝试的兴趣</div>
              <p>
                用户原话：“我想培养个爱好，但除了刷手机想不出还能做什么。”
                <br />
                场景还原：
                <br />
                •&nbsp;&nbsp;周末躺在床上，意识到这周除了工作和吃饭什么都没做
                <br />
                •&nbsp;&nbsp;打开小红书搜索“适合女生的爱好”，结果全是烘焙、插花、瑜伽
                <br />
                •&nbsp;&nbsp;感觉这些都不适合自己，但也不知道还有什么别的选项
                <br />
                •&nbsp;&nbsp;最终放弃思考，继续刷短视频
              </p>
            </div>
            <div className="pain-block second">
              <div className="pain-heading">痛点二：担心投入过高，三分钟热度浪费钱</div>
              <p>用户原话：“我怕买了装备后坚持不下来，最后东西吃灰，钱也花了，还觉得自己很失败。”</p>
            </div>
          </div>
          </PaperStack>
        </div>
      </div>
    </ModalCanvas>
  );
}

function AiOperationProjectPage({ onClose }) {
  return (
    <section className="spa-project-page" data-frame="AI/运营2-1" aria-label="AI/运营2-1">
      <button className="project-modal-close" type="button" onClick={onClose} aria-label="关闭AI/运营2-1">
        <img src={assets.iconClose} alt="关闭" draggable="false" />
      </button>
      <AiOperationProjectCanvas />
    </section>
  );
}

function FolderSection({ name, imageName = name, src, style, zIndex, onClick, children }) {
  return (
    <div
      className={`modal-layer folder-section ${name}-group ${onClick ? 'folder-section-clickable' : ''}`}
      data-layer={name}
      style={{ ...style, zIndex }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (event) => { if (event.key === 'Enter' || event.key === ' ') onClick(event); } : undefined}
    >
      <ModalImage name={imageName} src={src} style={{ left: 0, top: 0, width: style.width, height: style.height }} />
      {children}
    </div>
  );
}

function FolderTitle({ number, title, style }) {
  return (
    <ModalText name={`${number}-${title}`} className="folder-title" style={style}>
      <span>{number}</span>
      <span>{title}</span>
    </ModalText>
  );
}

function AiOperationFolderPage({ onClose, onOpenBrand, onOpenPoster, onOpenCoffee }) {
  return (
    <section className="spa-project-page project-folder-page" data-frame="AI/运营2-2" aria-label="AI/运营2-2">
      <button className="project-modal-close" type="button" onClick={onClose} aria-label="关闭AI/运营2-2">
        <img src={assets.iconClose} alt="关闭" draggable="false" />
      </button>
      <ModalCanvas>
        <FolderSection name="folder5" imageName="folder-page5" src={assets.folderPage5} style={{ left: 0, top: 169, width: 1280, height: 548 }} zIndex={1}>
          <ModalImage name="IP-thumbnail" src={assets.ipThumbnail} style={{ left: 476, top: -9.91, width: 245, height: 313, transform: 'rotate(4deg)' }} />
          <FolderTitle number="04" title="IP形象设计" style={{ left: 118, top: 52, gap: 16 }} />
        </FolderSection>
        <FolderSection name="folder4" imageName="folder-page4" src={assets.folderPage4} style={{ left: 0, top: 244, width: 1280, height: 473 }} zIndex={2} onClick={onOpenCoffee}>
          <ModalImage name="brand-thumbnail" src={assets.brandThumbnail} style={{ left: 311, top: 44, width: 388, height: 234 }} />
          <FolderTitle number="03" title="品牌运营设计" style={{ left: 844, top: 54 }} />
        </FolderSection>
        <FolderSection name="folder3" imageName="folder-page3" src={assets.folderPage3} style={{ left: 0, top: 342, width: 1280, height: 375 }} zIndex={3} onClick={onOpenPoster}>
          <ModalImage name="poster-thumbnail1" src={assets.posterThumbnail1} style={{ left: 459, top: 80.41, width: 271, height: 321, transform: 'rotate(-10deg)' }} />
          <ModalImage name="poster-thumbnail2" src={assets.posterThumbnail2} style={{ left: 741.77, top: 0, width: 262, height: 341, transform: 'rotate(12deg)' }} />
          <FolderTitle number="02" title="活动海报" style={{ left: 181, top: 47 }} />
        </FolderSection>
        <FolderSection name="folder2" imageName="folder-page2" src={assets.folderPage2} style={{ left: 0, top: 432, width: 1280, height: 285 }} zIndex={4} onClick={onOpenBrand}>
          <ModalImage name="beatuy-thumbnail" src={assets.beautyThumbnail} style={{ left: 299, top: 108, width: 632, height: 318 }} />
          <FolderTitle number="01" title="运营视觉重构" style={{ left: 24, top: 55 }} />
        </FolderSection>
        <FolderSection name="folder1" src={assets.folder1} style={{ left: 0, top: 568, width: 1280, height: 149 }} zIndex={5} />
      </ModalCanvas>
    </section>
  );
}

function PosterSectionHeading({ title, top }) {
  return (
    <>
      <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 60, top: top + 3, width: 10, height: 14 }} />
      <BrandText name={title} className="poster-section-title" style={{ left: 76, top }}>{title}</BrandText>
    </>
  );
}

function PosterImage({ name, src, left, top, width, height, className = '' }) {
  return <BrandImage name={name} src={src} className={`poster-image ${className}`} style={{ left, top, width, height }} />;
}

function PosterProcessCard({ left, title, titleLeft, titleWidth, children }) {
  return (
    <>
      <div className="poster-process-card" style={{ left, top: 611, width: 258, height: 268 }} />
      <BrandText name={title} className="poster-process-title" style={{ left: titleLeft, top: 619, width: titleWidth }}>{title}</BrandText>
      {children}
    </>
  );
}

function PosterIconDown({ left, top }) {
  return <BrandImage name="icon-down" src={assets.iconDown} style={{ left, top, width: 6, height: 6 }} />;
}

function PosterInstruction({ left, top, text }) {
  return (
    <>
      <BrandImage name="icon-right" src={assets.iconRight} style={{ left, top, width: 10, height: 14 }} />
      <BrandText name={text} className="poster-instruction" style={{ left: left + 16, top }}>{text}</BrandText>
    </>
  );
}

function PosterPlaceholder({ name, left, top, width = 235, height = 313 }) {
  return <div className="poster-placeholder" data-layer={name} style={{ left, top, width, height }} />;
}

function SynchronizedPosterGif({ name, src, left, top }) {
  return <PosterImage name={name} src={src} className="poster-gif" left={left} top={top} width={235} height={313} />;
}

function PosterStepFrame({ left, top, width, height, titleWidth, titleLeft, titleTop, textLeft, textTop, textWidth, title }) {
  return (
    <>
      <div className="poster-step-frame" style={{ left, top, width, height }} />
      <div className="poster-step-title-bg" style={{ left: titleLeft, top: titleTop, width: titleWidth }} />
      <BrandText name={title} className="poster-step-title" style={{ left: textLeft, top: textTop, width: textWidth ?? titleWidth - 16, height: 16 }}>{title}</BrandText>
    </>
  );
}

function PosterOperationPage({ onClose }) {
  const scale = useCanvasScale();
  const totalHeight = 3646;

  return (
    <section className="spa-project-page poster-operation-page" data-frame="AI/运营3-2" aria-label="AI/运营3-2">
      <button className="project-modal-close" type="button" onClick={onClose} aria-label="关闭AI/运营3-2">
        <img src={assets.iconClose} alt="关闭" draggable="false" />
      </button>
      <div className="brand-page-scroll poster-page-scroll">
        <div className="brand-page-viewport poster-page-viewport" style={{ height: px(totalHeight * scale) }}>
          <div className="brand-page-frame poster-page-frame" style={{ transform: `translateX(-50%) scale(${scale})`, height: totalHeight }}>
            <PosterImage name="poster-top-bg" src={assets.posterTopBg} left={0} top={0} width={1280} height={531} />
            <BrandText name="活动运营海报设计" className="poster-hero-title" style={{ left: 60, top: 238 }}>活动运营海报设计</BrandText>

            <PosterSectionHeading title="互动海报" top={567} />
            <PosterImage name="watermelon1-1" src={assets.watermelon1_1} left={60} top={611} width={201} height={268} />
            <PosterImage name="watermelon1-2" src="https://hardhardfish.dpdns.org/watermelon1-2.jpg?v=20261004" className="poster-shadow-watermelon-2" left={249} top={705} width={61} height={81} />
            <PosterImage name="watermelon1-3" src="https://hardhardfish.dpdns.org/watermelon1-3.jpg?v=20261004" className="poster-shadow-watermelon-3" left={249} top={798} width={61} height={81} />
            <PosterImage name="arrow4" src={assets.arrow4} left={280} top={752} width={59.34} height={147.2} />
            <PosterProcessCard left={438} title="素材生成" titleLeft={535} titleWidth={64}>
              <PosterIconDown left={563} top={639} />
              <PosterImage name="prompt1" src={assets.prompt1} left={446} top={649} width={238.76} height={69} />
              <PosterImage name="watermelon-scene1" src={assets.watermelonScene1} className="poster-shadow-scene" left={446} top={725} width={143} height={141} />
            </PosterProcessCard>
            <PosterProcessCard left={700} title="场景图处理" titleLeft={789} titleWidth={80}>
              <PosterIconDown left={826} top={639} />
              <PosterImage name="watermelon-scene2" src={assets.watermelonScene2} left={708} top={649} width={118} height={157} />
              <PosterImage name="watermelon-scene3" src={assets.watermelonScene3} left={832} top={649} width={118} height={157} />
              <PosterInstruction left={708} top={826} text="移除场景图上原有物体" />
              <PosterInstruction left={708} top={849} text="调整光影、色调" />
            </PosterProcessCard>
            <PosterProcessCard left={962} title="素材与场景图联结" titleLeft={1027} titleWidth={128}>
              <PosterIconDown left={1088} top={639} />
              <PosterImage name="watermelon-scene4" src={assets.watermelonScene4} className="poster-shadow-scene" left={970} top={649} width={118} height={157} />
              <PosterImage name="watermelon-scene5" src={assets.watermelonScene5} left={1094} top={649} width={118} height={157} />
              <PosterInstruction left={970} top={826} text="将素材融入场景图" />
              <PosterInstruction left={970} top={849} text="添加动效" />
            </PosterProcessCard>
            <BrandText name="老式夏天描述1" className="poster-memory-copy poster-memory-copy-one" style={{ left: 294, top: 1063, width: 197 }}>
              记忆中的老式夏天<br />是一口冰镇西瓜<br />是小卖部的一瓶冒泡汽水<br />是门口树荫下吱吱呀呀的旧摇椅<br />是一个安静的午后<br />风扇慢慢转动的嗡嗡声<br />和风穿过树叶的沙沙声<br />在燥热中传来一丝凉意
            </BrandText>
            <BrandText name="老式夏天系列" className="poster-memory-series" style={{ left: 349, top: 1237 }}>
              ——“老式夏天”系列
            </BrandText>
            <SynchronizedPosterGif name="watermelon-gif" src={assets.watermelonGif} left={506} top={940} />
            <SynchronizedPosterGif name="cola-gif" src={assets.colaGif} left={745} top={940} />
            <SynchronizedPosterGif name="chair-gif" src={assets.chairGif} left={985} top={940} />

            <PosterSectionHeading title="互动H5—摇奖机" top={1324} />
            <BrandText name="营销运用" className="poster-copy poster-description" style={{ left: 288, top: 1324 }}>
              营销运用：以"即时奖励+游戏化体验"为核心的用户参与引擎，通过随机性与视觉刺激激发用户行动欲望，可用于品牌裂变拉新、留存促活、节点转化等场景。运用AI进一步分析行为数据自动优化活动策略，让"随机奖励"变成"精准触达"的高效转化工具。
            </BrandText>
            <PosterStepFrame left={60} top={1387} width={230} height={244} titleWidth={154} titleLeft={68} titleTop={1393} textLeft={72} textTop={1399} title="•STEP 1：灵感溯源" />
            <PosterImage name="slotmachine1" src={assets.slotmachine1} left={68} top={1425} width={80} height={76} />
            <PosterImage name="slotmachine2" src={assets.slotmachine2} left={157} top={1425} width={106} height={76} />
            <BrandText name="处理内容：生成摇奖机造型图片，并处理多余" className="poster-step-copy" style={{ left: 68, top: 1532, width: 214, height: 61 }}>处理内容：生成摇奖机造型图片，并处理多余占位图，为后续素材放置预留位置</BrandText>
            <BrandText name="应用工具" className="poster-step-label" style={{ left: 68, top: 1605, width: 70, height: 14 }}>应用工具：</BrandText>
            <BrandText name="GEMINI+PHOTOSHO" className="poster-step-copy" style={{ left: 138, top: 1605, width: 149, height: 14 }}>GEMINI+PHOTOSHO</BrandText>

            <PosterStepFrame left={294} top={1387} width={248} height={244} titleWidth={154} textWidth={140} titleLeft={302} titleTop={1393} textLeft={306} textTop={1399} title="•STEP 2：素材处理" />
            <PosterImage name="prompt2" src={assets.prompt2} left={302} top={1425} width={232} height={130} />
            <BrandText name="处理内容2" className="poster-step-copy" style={{ left: 302, top: 1558, width: 230, height: 40 }}>处理内容：创建素材处理skill，批量处理素材组</BrandText>
            <BrandText name="应用工具2" className="poster-step-label" style={{ left: 302, top: 1605, width: 70, height: 14 }}>应用工具：</BrandText>
            <BrandText name="GEMINI+PHOTOSHO2" className="poster-step-copy" style={{ left: 372, top: 1605, width: 148, height: 14 }}>GEMINI+PHOTOSHO</BrandText>

            <PosterStepFrame left={60} top={1635} width={482} height={322} titleWidth={214} titleLeft={68} titleTop={1641} textLeft={72} textTop={1647} title="• STEP3：交互动效分析" />
            <PosterImage name="prompt3" src={assets.prompt3} left={68} top={1675} width={265} height={218} />
            <BrandText name="处理内容3" className="poster-step-label" style={{ left: 68, top: 1905, width: 70, height: 14 }}>处理内容：</BrandText>
            <BrandText name="交互过程分析定义、优化互动动效" className="poster-step-copy" style={{ left: 138, top: 1905, width: 203, height: 14 }}>交互过程分析定义、优化互动动效</BrandText>
            <BrandText name="应用工具3" className="poster-step-label" style={{ left: 68, top: 1931, width: 70, height: 14 }}>应用工具：</BrandText>
            <BrandText name="CHATGPT+CODEX" className="poster-step-copy poster-single-line" style={{ left: 138, top: 1931, width: 124, height: 14 }}>CHATGPT+CODEX</BrandText>

            <div className="brand-layer poster-section-c-preview" data-layer="sectionC" style={{ left: 60, top: 1324, width: 1160, height: 667 }}>
              <BrandText name="try it！" className="poster-try-it" style={{ left: 1106, top: 71, width: 48, height: 10 }}>try it！</BrandText>
              <BrandImage name="arrow6" src={assets.arrow6} style={{ left: '92.67%', right: '1.64%', top: '7.58%', bottom: '87.2%', width: '5.69%', height: '5.22%' }} />
              <iframe
                className="poster-html-preview"
                data-layer="html"
                src="https://lottery-h5.netlify.app"
                title="摇奖机项目"
                style={{ left: 498, top: 97, width: 662, height: 536 }}
              />
            </div>

            <PosterSectionHeading title="活动海报" top={2029} />
            <PosterStepFrame left={60} top={2073} width={497} height={210} titleWidth={176} titleLeft={68} titleTop={2081} textLeft={76} textTop={2087} title="风格海报生成步骤拆解" />
            <BrandText name="STEP1" className="poster-section-c-copy poster-section-c-step1" style={{ left: 68, top: 2121, width: 228, height: 14 }}>•STEP1：选择与活动内容相关的照片</BrandText>
            <BrandText name="STEP2" className="poster-section-c-copy poster-section-c-step2-label" style={{ left: 68, top: 2147, width: 63, height: 16 }}>•STEP2：</BrandText>
            <BrandText name="STEP2内容" className="poster-section-c-copy poster-section-c-step2-copy" style={{ left: 132, top: 2147, width: 192, height: 39 }}>将图片转化为稚拙手绘风格，并生成装饰元素</BrandText>
            <BrandText name="STEP3" className="poster-section-c-copy poster-section-c-step3" style={{ left: 68.5, top: 2198, width: 189, height: 14 }}>•STEP3：海报整体布局与排版</BrandText>
            <BrandText name="STEP4" className="poster-section-c-copy poster-section-c-step4" style={{ left: 68, top: 2224, width: 265, height: 45 }}>•STEP4：进一步做成动态海报，增加<br />吸引力</BrandText>
            <PosterImage name="flower1" src={assets.posterFlower1} left={347} top={2081} width={161} height={194} />
            <PosterImage name="flower2" src={assets.posterFlower2} left={471.19} top={2167} width={51.42} height={108} />
            <PosterImage name="arrow5" src={assets.arrow5} left={507.5} top={2135} width={37} height={81} />
            <SynchronizedPosterGif name="flower-gif" src={assets.flowerGif} left={746} top={2073} />
            <SynchronizedPosterGif name="city-food-gif" src={assets.cityFoodGif} left={985} top={2073} />

            <PosterSectionHeading title="其他主题衍生" top={2458} />
            <PosterImage name="donatebook" src={assets.posterDonatebook} left={60} top={2502} width={378} height={504} />
            <PosterImage name="fishing" src={assets.posterFishing} left={451} top={2502} width={378} height={504} />
            <PosterImage name="music" src={assets.posterMusic} left={842} top={2502} width={378} height={504} />
            <PosterImage name="coffee" src={assets.posterCoffee} left={60} top={3018} width={378} height={504} />
            <PosterImage name="citywalk-2" src={assets.posterCitywalk} left={451} top={3018} width={378} height={504} />
            <PosterImage name="foodmap" src={assets.posterFoodmap} left={842} top={3018} width={378} height={504} />
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandText({ name, children, style, className = '' }) {
  return <div className={`brand-layer brand-text ${className}`} data-layer={name} style={style}>{children}</div>;
}

function BrandImage({ name, src, style, className = '' }) {
  return <img className={`brand-layer brand-image ${className}`} data-layer={name} src={src} alt={name} style={style} draggable="false" />;
}

function BrandSectionHeading({ number, title, top, titleTop = top + 68, numberLeft = 72 }) {
  return (
    <>
      <BrandText name={`${number}-index`} className="brand-section-number" style={{ left: numberLeft, top }}>{number}</BrandText>
      <BrandText name={`${number}-title`} className="brand-section-title" style={{ left: 134, top: titleTop }}>{title}</BrandText>
    </>
  );
}

function BrandOperationPage({ onClose }) {
  const scale = useCanvasScale();
  const totalHeight = 10915;

  return (
    <section className="spa-project-page brand-operation-page" data-frame="AI/运营3-1" aria-label="AI/运营3-1">
      <button className="project-modal-close" type="button" onClick={onClose} aria-label="关闭AI/运营3-1">
        <img src={assets.iconClose} alt="关闭" draggable="false" />
      </button>
      <div className="brand-page-scroll">
        <div className="brand-page-viewport" style={{ height: px(totalHeight * scale), background: '#fbfbf9' }}>
          <div className="brand-page-frame" style={{ transform: `translateX(-50%) scale(${scale})`, height: totalHeight }}>
            <BrandImage name="beauty-top-bg" src={assets.beautyTopBg} style={{ left: 0, top: 0, width: 1280, height: 590 }} />
            <BrandText name="coa:ya" className="brand-kicker" style={{ left: 111, top: 107 }}>co : aya</BrandText>
            <BrandText name="运营视觉策略重构" className="brand-hero-title" style={{ left: 111, top: 167 }}>运营视觉策略重构</BrandText>
            {[
              ['01', '品牌视觉资产优化', '视觉资产管理'],
              ['02', '成分小卡计划', '内容资产建设'],
              ['03', '真实“晒单”证言', 'UGC运营'],
              ['04', '空瓶日记分享', '可持续传播'],
            ].map(([number, title, sub], index) => (
              <div key={number} className="brand-top-card" style={{ left: 95 + index * 277, top: 287 }}>
                <BrandText name={number} className="brand-card-number">{number}</BrandText>
                <BrandText name={title} className="brand-card-title">{title}</BrandText>
                <BrandText name={sub} className="brand-card-subtitle">{sub}</BrandText>
              </div>
            ))}
            {['拉新', '转化', '口碑', '留存'].map((label, index) => (
              <BrandText key={label} name={label} className="brand-funnel-step" style={{ left: 149 + index * 266, top: 452 }}>{label}</BrandText>
            ))}
            {[368, 634, 900].map((left) => (
              <BrandImage key={left} name="icon-down" src={assets.iconDown} className="brand-top-icon-down" style={{ left, top: 466, width: 12, height: 12 }} />
            ))}

            <div className="brand-section brand-section-b" />
            <BrandSectionHeading number="1" title="品牌分析" top={596} />
            <BrandText name="品牌定位" className="brand-label" style={{ left: 95, top: 720 }}>品牌定位</BrandText>
            <BrandText name="品牌定位描述" className="brand-callout section-a-callout" style={{ left: 95, top: 756 }}>柏林高端极简护肤品牌 —— 将德国实验室的临床级研发与极简护肤仪式结合，主打“少即是多，但绝不更简单”（Keep it simple, but not simpler）的护肤哲学。区别于传统奢侈护肤的“神秘感营销”与平价护肤的“堆砌成分”，Co:aya 以透明浓度标注+短INCI配方+多功能叠加建立差异化壁垒。</BrandText>
            <BrandText name="品牌Slogan" className="brand-label" style={{ left: 95, top: 868 }}>品牌 Slogan</BrandText>
            <BrandText name="slogan明细" className="brand-copy slogan-copy" style={{ left: 95, top: 904 }}>“Come As You Are”，旨在传递“每一寸肌肤都独一无二，值得量身定制护理”的理念。在中国市场的延伸表达聚焦为：“精简，但有效”或 “成分说真话”。</BrandText>
            <BrandText name="品牌理念" className="brand-label" style={{ left: 95, top: 952 }}>品牌理念</BrandText>
            <BrandText name="品牌理念描述" className="brand-copy wide" style={{ left: 95, top: 988 }}>• 剔除冗余，重塑肌理，升华本质：四步仪式（清洁→爽肤→精华→面霜）替代12步繁琐流程<br />• 透明即信任：明确标注活性成分浓度（如5%角鲨烷、0.5%依克多因、1.4%玻尿酸），打破奢侈品牌“不透明”惯例<br />• 科学不喧哗：以临床数据为支撑，不追逐成分潮流，只选用经证实的有效配方<br />• 可持续责任：纯素配方、无微塑料/硅油、可回收纸质包装、气候中性生产</BrandText>
            <BrandText name="运营策略分析" className="brand-label" style={{ left: 95, top: 1115 }}>运营策略分析</BrandText>
            <BrandText name="营销策略分析描述" className="brand-copy wide" style={{ left: 95, top: 1151 }}>• 内容策略：从“感觉和审美”转向“效果和科学”，强调成分、浓度、配方逻辑、解决什么问题<br />• 信息流优化：通过智能创意-标题优选功能提升点击<br />• 营销布局：以“空瓶日记”“晒单有礼”为标签，吸引用户互动、持续回购</BrandText>

            <div className="brand-section brand-section-c" />
            <BrandSectionHeading number="2" title="内容运营" top={1279} titleTop={1344} numberLeft={64} />
            <BrandText name="品牌视觉资产优化" className="brand-section-subtitle" style={{ left: 95, top: 1400 }}>PART 1  品牌视觉资产优化</BrandText>
            <BrandText name="问题现状" className="brand-label" style={{ left: 111, top: 1444 }}>问题现状</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 1447, width: 10, height: 14 }} />
            <BrandText name="风格碎片化" className="brand-pill" style={{ left: 134, top: 1518 }}>风格碎片化</BrandText>
            <BrandText name="风格碎片化描述" className="brand-copy brand-c-description-one" style={{ left: 289, top: 1562 }}>小红书笔记封面风格碎片化；封面之间几乎没有视觉关联</BrandText>
            <BrandText name="版式不统一" className="brand-pill" style={{ left: 134, top: 1689 }}>版式不统一</BrandText>
            <BrandText name="版式不统一描述" className="brand-copy brand-c-description-two" style={{ left: 289, top: 1733 }}>文案版式不统一，产品图与场景图各自为政，用户很难建立“这是同一个品牌”的认知</BrandText>
            <BrandImage name="主页图1" src={assets.homepage1} style={{ left: 837, top: 1491, width: 179, height: 367, zIndex: 2 }} />
            <BrandImage name="主页图2" src={assets.homepage2} style={{ left: 990, top: 1517, width: 165, height: 359 }} />
            <BrandText name="差异化切入点" className="brand-difference-title" style={{ left: 259, top: 1986 }}>差异化切入点</BrandText>
            <BrandText name="差异化切入点描述" className="brand-difference-copy" style={{ left: 153, top: 2022 }}>“不同场景，同一底色”，用户不需要每次看到一模一样的封面，但能通过“米色底 + 品牌紫点缀 + 统一角标”快速判断“这是 co:aya 的内容”。</BrandText>
            <BrandImage name="braces" src={assets.braces} className="brand-braces" style={{ left: 594, top: 1942, width: 22, height: 195 }} />
            {[
              ['色彩空间', '色彩空位：占中间空位“暖米色”，兼具温度与专业感', 1922],
              ['产品一致性', '产品一致性：主产品在场景图中尽量保持完全一致的产品形态', 1985],
              ['人因元素', '人因元素：带手部/肌肤接触的场景图优先用于封面', 2048],
              ['留白即品牌', '留白即品牌：封面保留不少于 20% 留白区域', 2111],
            ].map(([name, text, top]) => <BrandText key={name} name={name} className="brand-rule" style={{ left: 647, top }}>{text}</BrandText>)}

            <div className="brand-section brand-section-d" />
            <BrandText name="视觉规范" className="brand-label" style={{ left: 111, top: 2207 }}>视觉规范</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 2210, width: 10, height: 14 }} />
            <div className="brand-visual-spec-panel" data-layer="Rectangle 04">
              {[253, 616, 979].map((left, index) => (
                <div key={left} className="brand-spec-badge" style={{ left: left - 95 }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
              ))}
              <div className="brand-spec-divider" style={{ left: 363 }} />
              <div className="brand-spec-divider" style={{ left: 727 }} />
            </div>
            {['色彩同源', '文字同源', '符号同源'].map((label, index) => (
              <BrandText key={label} name={label} className="brand-spec" style={{ left: 245 + index * 363, top: 2351 }}>{label}</BrandText>
            ))}
            <BrandText name="色彩同源描述" className="brand-copy brand-d-description" style={{ left: 142, top: 2379 }}>统一 60/30/10 配色法则：60% 米色暖白、30% 白与浅灰、10% 品牌紫点缀</BrandText>
            <BrandText name="文字同源描述" className="brand-copy brand-d-description" style={{ left: 509, top: 2379 }}>封面统一“顶部一句功效承诺 + 底部品牌标识”，文字控制在 12 字以内</BrandText>
            <BrandText name="符号同源描述" className="brand-copy brand-d-description" style={{ left: 882, top: 2379 }}>所有封面统一加“co:aya ”角标，固定在右下角</BrandText>

            <div className="brand-section brand-section-e" />
            <BrandText name="视觉产出" className="brand-label" style={{ left: 110, top: 2518 }}>视觉产出</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 94, top: 2521, width: 10, height: 14 }} />
            <BrandText name="场景图" className="brand-label" style={{ left: 110, top: 2570 }}>场景图：</BrandText>
            <BrandText name="场景图描述" className="brand-copy brand-scene-description" style={{ left: 190, top: 2572 }}>用于品牌故事/用户互动/活动页头图，传递“科学可以很温暖”</BrandText>
            <BrandText name="场景图说明" className="brand-copy brand-scene-generation-description" style={{ left: 111, top: 3291 }}>场景图侧重氛围感与生活化共鸣，需突出产品类别与使用场景，据此搭建包含“场景构建、产品呈现、构图逻辑…”的AI生成参数框架，运用CHATGPT+LOVART实现场景图的批量高效替换、生成。</BrandText>
            <BrandText name="策略2" className="brand-callout section-a-callout" style={{ left: 95, top: 2604 }}>策略（一）“精简、纯净”产品场景图<br />传播目标：传递“少即是多”的生活方式美学，将四步护肤仪式转化为一种视觉上的呼吸感，让消费者感受到“精简不是将就，是更高级的选择”。</BrandText>
            <BrandImage name="icon-down" src={assets.iconDown} className="brand-icon-down" style={{ left: 191, top: 3235, width: 24, height: 24 }} />
            <div className="brand-chart-panel brand-chart-one" data-layer="chart1">
              {[2748, 2797, 2926, 2975, 3024, 3105, 3154].map((top) => <div key={top} className="brand-chart-line" style={{ top: top - 2700 }} />)}
              <BrandImage name="point2" src={assets.point2} className="brand-chart-point point2" style={{ left: 540, top: 728, width: 56, height: 172 }} />
              <BrandImage name="point1" src={assets.point1} className="brand-chart-point point1" style={{ left: 156, top: 1001, width: 144, height: 35 }} />
              <BrandImage name="point3" src={assets.point3} className="brand-chart-point point3" style={{ left: 788, top: 1133.5, width: 70, height: 1 }} />
              <BrandImage name="point4" src={assets.point4} className="brand-chart-point point4" style={{ left: 396.15, top: 1217.47, width: 35, height: 149.67 }} />
              <BrandText name="+提示词1" className="brand-chart-prompt prompt-one" style={{ left: 57, top: 971 }}>+<br />提示词<br />=</BrandText>
              <BrandText name="+提示词2" className="brand-chart-prompt prompt-two" style={{ left: 931, top: 1187 }}>+<br />提示词<br />=</BrandText>
              <BrandText name="+提示词3" className="brand-chart-prompt prompt-three" style={{ left: 809, top: 730 }}>+提示词=</BrandText>
              <BrandText name="+提示词4" className="brand-chart-prompt prompt-four" style={{ left: 347, top: 1451 }}>+提示词=</BrandText>
            </div>
            <BrandText name="视觉风格" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 2716 }}>视觉风格</BrandText>
            <BrandText name="视觉风格描述" className="brand-copy brand-chart-detail-copy chart-style-copy" style={{ left: 215, top: 2716 }}>北欧极简主义 + 侘寂美学</BrandText>
            <BrandText name="主色调" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 2765 }}>主色调</BrandText>
            <BrandText name="主色调描述" className="brand-copy brand-chart-detail-copy chart-color-copy" style={{ left: 215, top: 2765 }}>单色系渐变（如从浅米灰到白的过渡），场景不喧宾夺主，产品成为唯一视觉焦点</BrandText>
            <BrandText name="场景构建" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 2854 }}>场景构建</BrandText>
            <BrandText name="场景构建描述" className="brand-copy brand-chart-detail-copy chart-scene-copy" style={{ left: 215, top: 2814 }}>产品基础布景搭建：<br />• 产品按四步使用顺序排列（清洁→爽肤→精华→面霜），间距均匀，形成视觉韵律<br />• 基础置物底座，保持背景的干净、清爽<br />• 背景为素色渐变，可能有一道自然光斜射入，形成柔和的阴影</BrandText>
            <BrandText name="构图逻辑" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 2943 }}>构图逻辑</BrandText>
            <BrandText name="构图逻辑描述" className="brand-copy brand-chart-detail-copy chart-composition-copy" style={{ left: 215, top: 2943 }}>“一字型水平构图”或“黄金分割点构图”：产品不满屏，适当留白，传递“空间感=呼吸感=精简感”</BrandText>
            <BrandText name="光影处理" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 2992 }}>光影处理</BrandText>
            <BrandText name="光影处理描述" className="brand-copy brand-chart-detail-copy chart-light-copy" style={{ left: 215, top: 2992 }}>自然光为主，侧逆光勾勒产品轮廓，强调简单但不廉价的哑光包装质感；避免闪光灯的硬光，追求“清晨第一缕光”的温柔感</BrandText>
            <BrandText name="道具选择" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 3057 }}>道具选择</BrandText>
            <BrandText name="道具选择描述" className="brand-copy brand-chart-detail-copy chart-props-copy" style={{ left: 215, top: 3041 }}>• 天然材质：亚克力、银色金属、玻璃<br />• 产品基础布景搭建，保持背景的干净、清爽</BrandText>
            <BrandText name="产品呈现" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 3122 }}>产品呈现</BrandText>
            <BrandText name="产品呈现描述" className="brand-copy brand-chart-detail-copy chart-product-copy" style={{ left: 215, top: 3122 }}>产品标签尽可能面朝镜头，但不刻意摆正，略带生活感</BrandText>
            <BrandText name="关键词" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 3171 }}>关键词</BrandText>
            <BrandText name="关键词描述" className="brand-copy brand-chart-detail-copy chart-keyword-copy" style={{ left: 215, top: 3171 }}>留白、呼吸感、仪式、自然材质、不完美的完美</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 3295, width: 10, height: 14 }} />
            <BrandImage name="scene1-1" src={assets.scene1_1} style={{ left: 95, top: 3396, width: 173, height: 259 }} />
            <BrandImage name="scene1-2" src={assets.scene1_2} style={{ left: 95, top: 3747, width: 173, height: 259 }} />
            <BrandImage name="scene2-1" src={assets.scene2_1} style={{ left: 707, top: 3291, width: 181, height: 273 }} />
            <BrandImage name="scene2-2" src={assets.scene2_2} style={{ left: 1004, top: 3291, width: 181, height: 273 }} />
            <BrandImage name="scene3-1" src={assets.scene3_1} style={{ left: 969, top: 3611, width: 173, height: 260 }} />
            <BrandImage name="scene3-2" src={assets.scene3_2} style={{ left: 969, top: 3963, width: 173, height: 260 }} />
            <div className="brand-product-frame" data-layer="Rectangle" />
            <BrandImage name="product" src={assets.product} style={{ left: 421, top: 3626, width: 439, height: 273 }} />
            <BrandImage name="scene4-1" src={assets.scene4_1} style={{ left: 242, top: 4038, width: 184, height: 245 }} />
            <BrandImage name="scene4-2" src={assets.scene4_2} style={{ left: 542, top: 4038, width: 184, height: 245 }} />

            <div className="brand-section brand-section-f" />
            <BrandText name="产品图" className="brand-label" style={{ left: 110, top: 4339 }}>产品图</BrandText>
            <BrandText name="产品图描述" className="brand-copy brand-product-description" style={{ left: 190, top: 4341 }}>用于产品教育/成分科普/电商主图，让用户缩略图级别“认出是 co:aya”。</BrandText>
            <BrandText name="策略3" className="brand-callout section-a-callout" style={{ left: 95, top: 4373 }}>策略（二）：“质感、视觉焦点”产品主图<br />传播目标：在信息流中0.3秒抓住注意力，用强烈的质感对比与视觉焦点，传递“高端无负担”的产品价值，驱动点击与转化。</BrandText>
            <div className="brand-chart-panel brand-chart-two" data-layer="chart2">
              {[4517, 4566, 4647, 4728, 4777, 4826].map((top) => <div key={top} className="brand-chart-line" style={{ top: top - 4469 }} />)}
            </div>
            <BrandImage name="icon-down" src={assets.iconDown} className="brand-icon-down" style={{ left: 191, top: 4907, width: 24, height: 24 }} />
            <BrandText name="视觉风格F" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 4485 }}>视觉风格</BrandText>
            <BrandText name="视觉风格F描述" className="brand-copy brand-chart-detail-copy chart2-style-copy" style={{ left: 215, top: 4485 }}>德式精密×自然纯净，以材质层次的细腻对比与纯净光影，在嘈杂的社媒环境中形成“视觉降噪区”</BrandText>
            <BrandText name="主色调F" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 4534 }}>主色调</BrandText>
            <BrandText name="主色调F描述" className="brand-copy brand-chart-detail-copy chart2-color-copy" style={{ left: 215, top: 4534 }}>燕麦白/石灰白为基底，搭配原木色（橡木/桦木）与亚麻灰，营造“未经修饰的纯净”</BrandText>
            <BrandText name="构图逻辑F" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 4599 }}>构图逻辑</BrandText>
            <BrandText name="构图逻辑F描述" className="brand-copy brand-chart-detail-copy chart2-composition-copy" style={{ left: 215, top: 4583 }}>“中心对称 + 非对称介质环绕”：产品直立居中，占画面高度约55%–60%，形成稳定的视觉锚点，周围环绕装饰要素，呈非对称分布（如左下冰块+右上虚焦花卉），打破呆板，制造呼吸感。</BrandText>
            <BrandText name="质感表达" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 4680 }}>质感表达</BrandText>
            <BrandText name="质感表达描述" className="brand-copy brand-chart-detail-copy chart2-material-copy" style={{ left: 215, top: 4664 }}>•“透明 × 哑光”的材质对话：构成“纯净的可视化证据”<br />• 辅助材质：微水泥/洞石台面（粗糙哑光）、白色花瓣（柔软有机），与产品形成“硬vs软”“冷vs暖”的触觉通感</BrandText>
            <BrandText name="光影处理F" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 4745 }}>光影处理</BrandText>
            <BrandText name="光影处理F描述" className="brand-copy brand-chart-detail-copy chart2-light-copy" style={{ left: 215, top: 4745 }}>柔和侧逆光 + 漫射光为主</BrandText>
            <BrandText name="焦点策略" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 4794 }}>焦点策略</BrandText>
            <BrandText name="焦点策略描述" className="brand-copy brand-chart-detail-copy chart2-focus-copy" style={{ left: 215, top: 4794 }}>“标签可读性优先 + 质地可视化”双焦点，形成“产品→内容物→肌肤体验”的直接关联叙事。</BrandText>
            <BrandText name="关键词F" className="brand-label brand-chart-detail-label" style={{ left: 111, top: 4843 }}>关键词</BrandText>
            <BrandText name="关键词F描述" className="brand-copy brand-chart-detail-copy chart2-keyword-copy" style={{ left: 215, top: 4843 }}>哑光精密、暖白呼吸、材质对话、侧逆光晕、流动质地</BrandText>
            {[
              ['product1', assets.product1, 95, 4963, 306, 204], ['product2', assets.product2, 409, 4963, 306, 407],
              ['product4', assets.product4, 723, 4963, 306, 407], ['product7', assets.product7, 95, 5166, 306, 204],
              ['product6', assets.product6, 251, 5386, 306, 407], ['product3', assets.product3, 565, 5386, 306, 407],
              ['product5', assets.product5, 879, 5386, 306, 407],
            ].map(([name, src, left, top, width, height]) => <BrandImage key={name} name={name} src={src} style={{ left, top, width, height }} />)}

            <div className="brand-section brand-section-g" />
            <BrandText name="成分小卡计划" className="brand-section-subtitle" style={{ left: 95, top: 5849 }}>PART 2 成分小卡计划</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 5908, width: 10, height: 14 }} />
            <BrandText name="活动目标" className="brand-label" style={{ left: 111, top: 5905 }}>活动目标</BrandText>
            <BrandText name="直接/间接目标" className="brand-callout section-a-callout" style={{ left: 95, top: 5945 }}>直接目标：降低新客决策成本，让“成分党”用户在 30 秒内读懂“这瓶是什么、含什么、解决什么问题”。<br />间接目标：沉淀一套可复用的标准化产品教育素材，同时供给小红书、详情页、客服话术三个场景，避免重复生产。</BrandText>
            <BrandText name="创意概念" className="brand-label" style={{ left: 111, top: 6057 }}>创意概念——「成分说真话」</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 6060, width: 10, height: 14 }} />
            <div className="brand-info-panel brand-fixed-info" data-layer="固定信息层级">
              <BrandText name="固定信息层级" className="brand-panel-title" style={{ left: 36, top: 20 }}>固定信息层级</BrandText>
              <BrandImage name="Polygon 1" src={assets.polygon1} style={{ left: 220, top: 42, width: 96.34, height: 87 }} />
              <BrandImage name="Polygon 2" src={assets.polygon2} style={{ left: 190, top: 141, width: 156.57, height: 54.25 }} />
              <BrandImage name="Polygon 3" src={assets.polygon3} style={{ left: 160, top: 207, width: 216.49, height: 54.25 }} />
              <BrandImage name="Polygon 4" src={assets.polygon4} style={{ left: 129, top: 274, width: 279, height: 60 }} />
              <BrandText name="产品名" className="brand-info-node product-name-node">产品名</BrandText>
              <BrandText name="一个核心功效" className="brand-info-node benefit-node">一个核心功效</BrandText>
              <BrandText name="关键成分" className="brand-info-node ingredient-node">关键成分</BrandText>
              <BrandText name="适用人群/状况" className="brand-info-node audience-node">适用人群/状况</BrandText>
            </div>
            <div className="brand-info-panel brand-execution" data-layer="执行要求">
              <BrandText name="执行要求" className="brand-panel-title" style={{ left: 36, top: 20 }}>执行要求</BrandText>
              <BrandImage name="card-icon1" src={assets.cardIcon1} style={{ left: 56, top: 79, width: 46, height: 46 }} />
              <BrandImage name="card-icon2" src={assets.cardIcon2} style={{ left: 56, top: 168, width: 46, height: 46 }} />
              <BrandImage name="card-icon3" src={assets.cardIcon3} style={{ left: 56, top: 252, width: 46, height: 46 }} />
              <BrandText name="一产品一卡" className="brand-info-item" style={{ left: 122, top: 83 }}>一产品一卡<br /><small>聚焦核心信息，避免信息过载</small></BrandText>
              <BrandText name="核心成分作为内容锚点" className="brand-info-item" style={{ left: 122, top: 172 }}>核心成分作为内容锚点<br /><small>配料公开建立专业信任</small></BrandText>
              <BrandText name="线性图标与进度条做轻量可视化" className="brand-info-item" style={{ left: 122, top: 256 }}>线性图标与进度条做轻量可视化<br /><small>让成分功效一目了然</small></BrandText>
            </div>
            <BrandImage name="icon-down" src={assets.iconDown} className="brand-icon-down" style={{ left: 632, top: 6503, width: 16, height: 16 }} />
            <BrandText name="视觉方向" className="brand-label" style={{ left: 600, top: 6539 }}>视觉方向</BrandText>
            <BrandText name="视觉方向描述" className="brand-copy brand-visual-direction" style={{ left: 316, top: 6575 }}>• 保持“实验室报告”般的克制感<br />• 核心成分剖析，用户记住的不是“这牌子很温和”，而是“产品能达到什么功效“</BrandText>
            <BrandImage name="card1" src={assets.card1} style={{ left: 101, top: 6655, width: 335, height: 446 }} />
            <BrandImage name="card2" src={assets.card2} style={{ left: 473, top: 6655, width: 335, height: 446 }} />
            <BrandImage name="card3" src={assets.card3} style={{ left: 845, top: 6655, width: 335, height: 446 }} />
            <BrandText name="传播策略与评估" className="brand-label brand-strategy-title" style={{ left: 570, top: 7169 }}>传播策略与评估</BrandText>
            <div className="brand-strategy-panel" data-layer="策略与评估">
              <BrandText name="常青型内容" className="brand-strategy-pill" style={{ left: 51, top: 71 }}>常青型内容，不追热点，按上新节奏滚动更新</BrandText>
              <BrandText name="搜索卡位" className="brand-strategy-pill" style={{ left: 51, top: 134 }}>做重点搜索卡位，卡片标题直接埋成分关键词</BrandText>
              <BrandText name="卡片铺设" className="brand-strategy-pill" style={{ left: 51, top: 197 }}>完成全 SKU 卡片铺设，承接大促搜索峰值</BrandText>
              {[
                ['搜索卡位', '成分关键搜索曝光提升', '+68%', 616, 46, 64, 91],
                ['关键词进店量', '成分相关搜索带来进店', '+41%', 616, 168, 96, 84],
                ['收藏率/点赞比', '成分科普内容互动提升', '+52%', 898, 46, 102, 89],
                ['客服成分咨询下降', '内容前置减少重复咨询', '-37%', 898, 168, 128, 80],
              ].map(([title, detail, value, left, top, titleWidth, valueWidth]) => (
                <div key={title} className="brand-metric" style={{ left, top }}>
                  <BrandText name={title} className="brand-metric-title" style={{ width: titleWidth }}>{title}</BrandText>
                  <BrandText name={detail} className="brand-metric-detail" style={{ width: 140 }}>{detail}</BrandText>
                  <BrandText name={value} className="brand-metric-value" style={{ width: valueWidth }}>{value}</BrandText>
                </div>
              ))}
              <BrandImage name="card-icon4" src={assets.cardIcon4} style={{ left: 550, top: 46, width: 46, height: 46 }} />
              <BrandImage name="card-icon5" src={assets.cardIcon5} style={{ left: 550, top: 168, width: 46, height: 46 }} />
              <BrandImage name="card-icon6" src={assets.cardIcon6} style={{ left: 832, top: 46, width: 46, height: 46 }} />
              <BrandImage name="card-icon7" src={assets.cardIcon7} style={{ left: 832, top: 168, width: 46, height: 46 }} />
            </div>
            <BrandImage name="icon-down" src={assets.iconDown} className="brand-icon-down" style={{ left: 632, top: 7133, width: 16, height: 16 }} />

            <div className="brand-section brand-section-h" />
            <BrandText name="真实晒单" className="brand-section-subtitle" style={{ left: 95, top: 7585 }}>PART 3 真实晒单“证言”</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 7644, width: 10, height: 14 }} />
            <BrandText name="活动目标" className="brand-label" style={{ left: 111, top: 7641 }}>活动目标</BrandText>
            <BrandText name="活动目标描述" className="brand-callout section-a-callout" style={{ left: 95, top: 7677 }}>• 把品牌目前“等用户好评出现”的被动状态，改造成可运营、可沉淀的 UGC 内容池<br />• 用“好坏不限、条条真实”的机制，建立成分党圈层最稀缺的信任资产：可验证的真实评价</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 7816, width: 10, height: 14 }} />
            <BrandText name="问题分析" className="brand-label" style={{ left: 111, top: 7813 }}>问题分析</BrandText>
            <div className="brand-issue-number" style={{ left: 95, top: 7910 }}>01</div>
            <BrandText name="活动识别与利益点不够集中" className="brand-label brand-issue-title" style={{ left: 139, top: 7914 }}>活动识别与利益点不够集中</BrandText>
            <BrandText name="利益点描述" className="brand-copy brand-issue-copy" style={{ left: 139, top: 7942 }}>搜索流中活动识别度一般，用户难以捕捉到活动机制内容；“真实晒单”差异点不够突出，“真实”尚未成为稳定的视觉记忆点</BrandText>
            <div className="brand-issue-number" style={{ left: 95, top: 8026 }}>02</div>
            <BrandText name="视觉统一性不足" className="brand-label brand-issue-title" style={{ left: 139, top: 8030 }}>视觉统一性不足</BrandText>
            <BrandText name="统一性描述" className="brand-copy brand-issue-copy" style={{ left: 139, top: 8058 }}>现有封面信息分散，存在等多种视觉语言，系列感偏弱；利益点露出不够稳定，缺少统一视觉锤</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 8199, width: 10, height: 14 }} />
            <BrandText name="运营方案" className="brand-label" style={{ left: 111, top: 8196 }}>运营方案</BrandText>
            <div className="brand-soft-box brand-visual-language-box" />
            <BrandText name="视觉语言" className="brand-soft-box-label" style={{ left: 337, top: 8282 }}>视觉语言</BrandText>
            <div className="brand-soft-box brand-feedback-box" />
            <BrandText name="反馈激励" className="brand-soft-box-label" style={{ left: 881, top: 8282 }}>反馈激励</BrandText>
            <BrandText name="+" className="brand-operation-plus" style={{ left: 632, top: 8278 }}>+</BrandText>
            <BrandText name="视觉语言描述" className="brand-copy brand-operation-copy" style={{ left: 166, top: 8360 }}>• 建立固定阅读顺序：晒单有礼 → 10元券 → 真实分享即可，提升信息流中的瞬时识别<br />• 暖米白、品牌紫、深灰黑作为核心配色，固定品牌角标、产品露出与版式结构，让用户能快速识别 co:aya</BrandText>
            <BrandText name="反馈激励描述" className="brand-copy brand-operation-copy" style={{ left: 711, top: 8360 }}>• 用“必得”的确定性激励（无门槛10 元券），驱动沉默的大多数参与<br />• 官方对真实差评公开回应：48 小时内回应 + 给出解决方案，并允许差评出现在品牌内容里</BrandText>
            <div className="brand-core-strategy-box" />
            <BrandText name="核心策略" className="brand-core-strategy-title" style={{ left: 191, top: 8524 }}>核心策略</BrandText>
            <BrandText name="核心策略描述" className="brand-copy brand-core-strategy-copy" style={{ left: 240, top: 8508 }}>• 激励机制：晒单返券/积分，金额不必高（10 元券即可），关键是“必得”的确定性<br />• 配套机制：官方对真实差评的公开回应要展示出来，并允许差评出现在品牌内容里<br />• 视觉机制：统一视觉语言，在信息流中能被用户快速捕捉</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 8659, width: 10, height: 14 }} />
            <BrandText name="社媒宣传" className="brand-label" style={{ left: 111, top: 8656 }}>社媒宣传</BrandText>
            {[
              ['share1', assets.share1, 663, 7875], ['share2', assets.share2, 841, 7875], ['share3', assets.share3, 1019, 7875],
              ['share4', assets.share4, 114, 8708], ['share5', assets.share5, 494, 8708], ['share6', assets.share6, 874, 8708],
            ].map(([name, src, left, top]) => <BrandImage key={name} name={name} src={src} className={top === 8708 ? 'brand-shadow-image' : ''} style={{ left, top, width: top === 7875 ? 166 : 292, height: top === 7875 ? 265 : 626 }} />)}

            <div className="brand-section brand-section-i" />
            <BrandText name="空瓶日记分享" className="brand-section-subtitle" style={{ left: 95, top: 9390 }}>PART 4 空瓶日记分享</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 9449, width: 10, height: 14 }} />
            <BrandText name="活动目标" className="brand-label" style={{ left: 111, top: 9446 }}>活动目标</BrandText>
            <BrandText name="活动目标描述" className="brand-callout section-a-callout" style={{ left: 95, top: 9486 }}>• 把“可持续”从官网上一句静态话术，变成用户可参与、可晒出的动态品牌体验。<br />• 在国内无法复制德国“Gelber Sack”回收体系的现实约束下，用“记录空瓶”的方式低成本传递可回收理念，同时自然拉动复购。</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 9625, width: 10, height: 14 }} />
            <BrandText name="活动理念" className="brand-label" style={{ left: 111, top: 9622 }}>活动理念</BrandText>
            <BrandText name="活动理念描述" className="brand-callout section-a-callout" style={{ left: 95, top: 9662 }}>• 一个空瓶 = 一段被认真对待的护肤时光 = 一次复购的自然起点。<br />• 极简包装不是抠门，是减少浪费、降低碳排的主动选择——这句话必须说给用户听，否则极简会被误读为“贵且少”。</BrandText>
            <BrandText name="运营分析" className="brand-label" style={{ left: 111, top: 9798 }}>运营分析</BrandText>
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 95, top: 9801, width: 10, height: 14 }} />
            <div className="brand-issue-number" style={{ left: 95, top: 9851 }}>01</div>
            <BrandText name="问题现状" className="brand-label brand-issue-title" style={{ left: 139, top: 9855 }}>问题现状</BrandText>
            <BrandText name="问题现状描述" className="brand-copy brand-issue-copy brand-issue-copy-i" style={{ left: 139, top: 9883 }}>可持续停留在官网文案，用户无感知、无参与<br />国内无法复制德国式全民回收体系，理念落地困难</BrandText>
            <div className="brand-issue-number" style={{ left: 95, top: 9969 }}>02</div>
            <BrandText name="推广思路" className="brand-label brand-issue-title" style={{ left: 139, top: 9973 }}>推广思路</BrandText>
            <BrandText name="推广思路描述" className="brand-copy brand-issue-copy brand-issue-copy-i brand-issue-copy-i-secondary" style={{ left: 139, top: 10001 }}>用“记录空瓶”替代“回收空瓶”，降低参与门槛<br />把空瓶变成“效果证据 + 环保叙事”的双重符号，自然衔接复购</BrandText>
            <div className="brand-core-strategy-box brand-core-strategy-box-i" />
            <BrandText name="核心策略I" className="brand-label brand-core-strategy-title-i" style={{ left: 682, top: 9862 }}>核心策略</BrandText>
            <BrandText name="核心策略描述I" className="brand-copy brand-core-strategy-copy-i" style={{ left: 682, top: 9894 }}>• 参与方式：晒出空瓶照片 + 开封日期/使用天数 + 一句话肌肤变化记录，即可获积分或下次购买优惠。<br />• 进阶玩法：设置“空瓶计数”——用户晒“我的第 N 个 co:aya 空瓶”，N 越大权益越好，把复购行为游戏化。<br />• 可选背书：与第三方回收机构做阶段性“空瓶寄回”活动，让理念落地一次、被报道一次。</BrandText>
            <BrandImage name="icon-down" src={assets.iconDown} className="brand-icon-down brand-icon-down-i" style={{ left: 603, top: 9941, width: 16, height: 16 }} />
            <BrandImage name="icon-right" src={assets.iconRight} style={{ left: 91, top: 10120, width: 10, height: 14 }} />
            <BrandText name="社媒宣传" className="brand-label" style={{ left: 107, top: 10117 }}>社媒宣传</BrandText>
            <BrandImage name="empty1" src={assets.empty1} className="brand-shadow-image" style={{ left: 114, top: 10169, width: 292, height: 626 }} />
            <BrandImage name="empty2" src={assets.empty2} className="brand-shadow-image" style={{ left: 494, top: 10169, width: 292, height: 626 }} />
            <BrandImage name="empty3" src={assets.empty3} className="brand-shadow-image" style={{ left: 874, top: 10169, width: 292, height: 626 }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TransitionAiUx({ onOpenProject, onOpenFolder, onOpenUxUiSecond }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return undefined;

    const ctx = gsap.context(() => {
      const objectLayer = stage.querySelector('.ai-ux-object-layer');
      const outgoingObjects = objectLayer.querySelectorAll(':scope > .ai-computer, :scope > .notebook, :scope > .pen-cup, :scope > .folder, :scope > .coffee, :scope > .leave, :scope > .project-open-group');
      const titleAi = stage.querySelector('.title-ai');
      const titleUx = stage.querySelector('.title-ux\\/ui');
      const hints = stage.querySelectorAll('.more-label, .image-button, .arrow2');
      const uxProjects = stage.querySelectorAll('.project1, .project2');
      const uxHint = stage.querySelector('.click-hint');
      const uxWindow = stage.querySelector('.browser-window-frame');
      const screen = stage.querySelector('.screen-shape');
      const keyboard = stage.querySelector('.keyboard');
      const aiNavigation = stage.querySelector('.ai-ux-ai-left-navigation');
      const uxNavigation = stage.querySelector('.ai-ux-left-navigation');
      const exploreNavigation = stage.querySelector('.ai-ux-explore-left-navigation');
      const objectOffsets = [
        [objectLayer.querySelector(':scope > .ai-computer'), 0, 0, -323, -412, 0, 0],
        [objectLayer.querySelector(':scope > .notebook'), 0, 554, -247, 804, 0, 554],
        [objectLayer.querySelector(':scope > .pen-cup'), 1157, 184, 1632, -54, 1157, 184],
        [objectLayer.querySelector(':scope > .folder'), 834, 410, 1123, 803, 834, 410],
        [objectLayer.querySelector(':scope > .coffee'), 938, 0, 972, -354, 938, 0],
        [objectLayer.querySelector(':scope > .leave'), 396, 0, 375, -412, 396, 0],
        [objectLayer.querySelector(':scope > .project-open-group'), 74.96, 381.17, 43, 800, 72, 380],
      ];

      gsap.set(stage.querySelector('.full-computer'), { transformOrigin: 'center center', x: 0, y: 0, scaleX: 1, scaleY: 1 });
      gsap.set([screen, keyboard], { autoAlpha: 0 });
      gsap.set(outgoingObjects, { autoAlpha: 1 });
      gsap.set(titleAi, { autoAlpha: 1, y: 0 });
      gsap.set(titleUx, { autoAlpha: 0, y: 159 });
      gsap.set(hints, { autoAlpha: 1 });
      gsap.set(uxProjects, { autoAlpha: 0, y: 0 });
      gsap.set(uxHint, { autoAlpha: 0 });
      gsap.set(uxWindow, { autoAlpha: 0, y: 0 });
      gsap.set(aiNavigation, { autoAlpha: 1 });
      gsap.set(uxNavigation, { autoAlpha: 0 });
      gsap.set(exploreNavigation, { autoAlpha: 0 });
      objectOffsets.forEach(([element, startLeft, startTop, , , baseLeft, baseTop]) => {
        if (!element) return;
        gsap.set(element, { x: startLeft - baseLeft, y: startTop - baseTop });
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=3100',
          scrub: 1,
          pin: stage,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });

      objectOffsets.forEach(([element, , , endLeft, endTop, baseLeft, baseTop]) => {
        if (!element) return;
        tl.to(element, { x: endLeft - baseLeft, y: endTop - baseTop, duration: 0.2 }, 0.3);
      });

      tl.to(hints, { autoAlpha: 0, duration: 0.2 }, 0.3)
        .to(titleAi, { autoAlpha: 0, y: -155, duration: 0.3 }, 0.3)
        .to(outgoingObjects, { autoAlpha: 0, duration: 0.05 }, 0.45)
        .set(outgoingObjects, { visibility: 'hidden' }, 0.5)
        .to(titleUx, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7)
        .set(aiNavigation, { autoAlpha: 0 }, 0.95)
        .set(uxNavigation, { autoAlpha: 1 }, 0.95)
        .to(titleUx, { y: -339, autoAlpha: 0, duration: 0.6 }, 1)
        .to(uxProjects, { y: -92, autoAlpha: 1, duration: 0.3 }, 1.6)
        .to(uxHint, { autoAlpha: 1, duration: 0.15 }, 1.9)
        .to(uxWindow, { y: -102, autoAlpha: 1, duration: 0.15 }, 1.95)
        .to(uxProjects, { autoAlpha: 0, duration: 0.2 }, 2.4)
        .to(uxHint, { autoAlpha: 0, duration: 0.2 }, 2.4)
        .to(uxWindow, { x: -763, y: -697, duration: 0.7 }, 2.4)
        .set(uxProjects, { visibility: 'hidden' }, 2.6)
        .set(uxHint, { visibility: 'hidden' }, 2.6)
        .set(uxNavigation, { autoAlpha: 0 }, 3.05)
        .set(exploreNavigation, { autoAlpha: 1 }, 3.05);
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ai-ux-scroll-section frame-shell" data-frame="转场“AI/运营-UX/UI项目”">
      <div id="ai-ux" className="ai-ux-anchor" aria-hidden="true" />
      <div ref={stageRef} className="ai-ux-pin-viewport">
        <div className="figma-frame ai-ux-transition-stage">
          <FullComputer variant="ai-ux-transition" style={{ left: -225, top: -94, width: 1730, height: 1115 }} />
          <div className="ai-ux-object-layer">
            <DeskObjectLayers onOpenProject={onOpenProject} onOpenFolder={onOpenFolder} />
          </div>
          <TextLayer name="title-ai" className="section-title" style={{ left: 395, top: 309, width: 490 }}>
            AI/运营
          </TextLayer>
          <TextLayer name="title-ux/ui" className="section-title" style={{ left: 290, top: 309, width: 700 }}>
            UX/UI项目
          </TextLayer>
          <BrowserWindowFrame style={{ left: 795, top: 733 }}>
            <TextLayer name="title-个人探索" className="window-title" style={{ left: 329, top: 136 }}>
              个人探索
            </TextLayer>
            <Folder name="small-folder1" style={{ left: 329, top: 242 }} label="账号笔记" />
            <Folder name="small-folder2" style={{ left: 580, top: 242 }} label="摄影随拍" />
          </BrowserWindowFrame>
          <Layer name="project1" className="ux-explore-project project1" style={{ left: 95, top: 148 }} onClick={onOpenUxUiSecond} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onOpenUxUiSecond?.(); }}>
            <ImageLayer name="styleA" src={assets.uxStyleA} style={{ left: 12, top: 12, width: 328, height: 184 }} />
            <TextLayer name="颐养生活消费季" className="ux-explore-project-title" style={{ left: 16, top: 216 }}>颐养生活消费季</TextLayer>
          </Layer>
          <Layer name="project2" className="ux-explore-project project2" style={{ left: 464, top: 148 }}>
            <div className="ux-explore-project-default" />
            <ImageLayer name="default1" src={assets.uxDefault1} style={{ left: 95, top: 35, width: 150, height: 150 }} />
            <TextLayer name="项目更新中" className="ux-explore-project-title" style={{ left: 15, top: 216 }}>项目更新中...</TextLayer>
          </Layer>
          <ArrowHint name="arrow3" label="点击此处" x={879} y={583} arrowY={10} />
          <button
            type="button"
            className="layer more-label project-open-trigger"
            style={{ left: 231, top: 369 }}
            onClick={onOpenProject}
            data-layer="点击探索更多"
          >
            点击探索更多
          </button>
          <button
            type="button"
            className="layer image-button"
            style={{ left: 253, top: 384, width: 67, height: 22 }}
            onClick={onOpenProject}
            data-layer="arrow1-trigger"
            aria-label="打开AI/运营2-1"
          >
            <img src={assets.arrow1} alt="arrow1" draggable="false" />
          </button>
          <TextLayer name="点击探索更多" className="more-label" style={{ left: 1002, top: 445 }}>
            点击探索更多
          </TextLayer>
          <ImageLayer name="arrow2" src={assets.arrow2} style={{ left: 955, top: 455, width: 94, height: 37.28 }} />
          <LeftNavigation active="AI/运营" className="ai-ux-ai-left-navigation" />
          <LeftNavigation active="UX/UI" className="ai-ux-left-navigation" />
          <LeftNavigation active="个人探索" className="ai-ux-explore-left-navigation" />
        </div>
      </div>
    </section>
  );
}

function BrowserWindow({ className = '', style }) {
  return <ImageLayer name="window" className={`browser-window ${className}`} src={assets.window} style={{ ...style, width: 1216, height: 713 }} />;
}

function BrowserWindowFrame({ className = '', style, children }) {
  return (
    <Layer name="window" className={`browser-window-frame ${className}`} style={{ ...style, width: 1216, height: 713 }}>
      <BrowserWindow style={{ left: 0, top: 0 }} />
      {children}
    </Layer>
  );
}

function Folder({ name, style, label, onClick, interactiveOpen = false }) {
  const isFolder2 = name === 'small-folder2' && interactiveOpen;
  const src = name.includes('2') ? assets.smallFolder2 : assets.smallFolder1;

  return (
    <Layer name={name} className={`small-folder ${isFolder2 ? 'small-folder2-interactive' : ''}`} style={style} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? (event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); } : undefined}>
      <ImageLayer name={name} className={isFolder2 ? 'small-folder2-default' : ''} src={src} style={{ left: 0, top: 0, width: 155, height: 126.5 }} />
      {isFolder2 ? (
        <>
          <ImageLayer name="small-folder2-front" className="small-folder2-open-front" src={assets.smallFolder2Front} />
          <div className="small-folder2-photo-stack">
            <ImageLayer name="photo-thumbnail1" className="small-folder2-photo photo-thumbnail1" src={assets.photoThumbnail1} />
            <ImageLayer name="photo-thumbnail2" className="small-folder2-photo photo-thumbnail2" src={assets.photoThumbnail2} />
            <ImageLayer name="photo-thumbnail3" className="small-folder2-photo photo-thumbnail3" src={assets.photoThumbnail3} />
          </div>
          <ImageLayer name="small-folder2-back" className="small-folder2-open-back" src={assets.smallFolder2Back} />
        </>
      ) : null}
      {label ? <TextLayer name={label} className="folder-label">{label}</TextLayer> : null}
    </Layer>
  );
}

function TransitionUxExplore({ onOpenUxUiSecond }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return undefined;

    const ctx = gsap.context(() => {
      const titleUx = stage.querySelector('.title-ux\\/ui');
      const projects = stage.querySelectorAll('.project1, .project2');
      const hint = stage.querySelector('.click-hint');
      const windowFrame = stage.querySelector('.browser-window-frame');
      const screen = stage.querySelector('.screen-shape');
      const keyboard = stage.querySelector('.keyboard');

      gsap.set([screen, keyboard], { autoAlpha: 0 });
      gsap.set(titleUx, { autoAlpha: 1, y: 0 });
      gsap.set(projects, { autoAlpha: 0, y: 0 });
      gsap.set(hint, { autoAlpha: 0 });
      gsap.set(windowFrame, { autoAlpha: 0, y: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=1600',
          scrub: 1,
          pin: stage,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });

      tl.to(titleUx, { y: -339, autoAlpha: 0, duration: 0.6 }, 0)
        .to(projects, { y: -92, autoAlpha: 1, duration: 0.3 }, 0.6)
        .to(hint, { autoAlpha: 1, duration: 0.15 }, 0.9)
        .to(windowFrame, { y: -102, autoAlpha: 1, duration: 0.15 }, 0.95)
        .to({}, { duration: 0.5 }, 1.1);
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="ux-explore" className="ux-explore-internal-scroll-section frame-shell" data-frame="转场“UX/UI项目-个人探索”">
      <div ref={stageRef} className="ux-explore-pin-viewport">
        <div className="figma-frame ux-explore-internal-stage">
          <FullComputer variant="ux-explore" style={{ left: -225, top: -94, width: 1730, height: 1115 }} />
          <TextLayer name="title-ux/ui" className="section-title" style={{ left: 290, top: 309, width: 700 }}>
            UX/UI项目
          </TextLayer>
          <BrowserWindowFrame style={{ left: 795, top: 733 }}>
            <TextLayer name="title-个人探索" className="window-title" style={{ left: 329, top: 136 }}>
              个人探索
            </TextLayer>
            <Folder name="small-folder1" style={{ left: 329, top: 242 }} label="账号笔记" />
            <Folder name="small-folder2" style={{ left: 580, top: 242 }} label="摄影随拍" />
          </BrowserWindowFrame>
          <LeftNavigation active="UX/UI" />
          <Layer name="project1" className="ux-explore-project project1" style={{ left: 95, top: 148 }} onClick={onOpenUxUiSecond} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onOpenUxUiSecond?.(); }}>
            <ImageLayer name="styleA" src={assets.uxStyleA} style={{ left: 12, top: 12, width: 328, height: 184 }} />
            <TextLayer name="颐养生活消费季" className="ux-explore-project-title" style={{ left: 16, top: 216 }}>颐养生活消费季</TextLayer>
          </Layer>
          <Layer name="project2" className="ux-explore-project project2" style={{ left: 464, top: 148 }}>
            <div className="ux-explore-project-default" />
            <ImageLayer name="default1" src={assets.uxDefault1} style={{ left: 95, top: 35, width: 150, height: 150 }} />
            <TextLayer name="项目更新中" className="ux-explore-project-title" style={{ left: 15, top: 216 }}>项目更新中...</TextLayer>
          </Layer>
          <ArrowHint name="arrow3" label="点击此处" x={879} y={583} arrowY={10} />
        </div>
      </div>
    </section>
  );
}

function Explore({ onOpenExploreSecond }) {
  return (
    <DesignFrame id="explore" frameName="个人探索">
      <FullComputer variant="explore" style={{ left: -225, top: -94, width: 1730, height: 1115 }} />
      <BrowserWindowFrame style={{ left: 32, top: 36 }}>
        <Folder name="small-folder1" style={{ left: 329, top: 242 }} label="账号笔记" onClick={onOpenExploreSecond} />
        <TextLayer name="title-个人探索" className="window-title" style={{ left: 329, top: 136 }}>
          个人探索
        </TextLayer>
      </BrowserWindowFrame>
      <LeftNavigation active="个人探索" />
    </DesignFrame>
  );
}

function XhsNav({ active }) {
  return <div className="xhs-nav">{['确定账号定位', '对标博主账号拆解', '内容规划', '笔记发布', '数据复盘'].map((item, index) => <React.Fragment key={item}><div className={index === active ? 'active' : ''}>{item}</div>{index < 4 ? <img src={assets.iconDown} alt="" /> : null}</React.Fragment>)}</div>;
}

function XhsTable({ className = '', firstHeader = '', headers, rows }) {
  return <div className={`xhs-table ${className}`}><div className="xhs-table-head"><strong>{firstHeader}</strong>{headers.map((header) => <strong key={header}>{header}</strong>)}</div>{rows.map(([label, ...cells], rowIndex) => <div className="xhs-table-row" key={`${label}-${rowIndex}`}><strong>{label}</strong>{cells.map((cell, cellIndex) => <p key={`${rowIndex}-${cellIndex}`}>{cell}</p>)}</div>)}</div>;
}

function ExploreSecondPage({ onClose }) {
  const scale = useCanvasScale();
  const totalHeight = 3524;
  const directionRows = [
    ['定位', '轻体验城市探索', '成长型实验记录', '……'],
    ['一句话简介', '出行不只有打卡，更有节奏、体感和情绪设计。', '记录一个“三分钟热度”，如何收获每一次实践的快乐与收获。', '……'],
    ['目标用户画像', '重视体验质量多于打卡数量、对“累”敏感、希望通过“短游”带来放松或充能感', '同样兴趣多变、难以坚持、却不想因此停止探索的“成长型体验者”，最难的其实是行动起来', '……'],
    ['核心内容选题', '节奏蓝图：发布强调节奏感的旅行日程，明确标注“暴走段”、“发呆段”、“沉浸体验段”，并说明设计理由。\n\n情绪旅行包：针对“想一个人静静”、“想振奋一下”等情绪需求，设计对应的微旅行或城市漫步路线。', '实验启动：宣布开启一个新兴趣实验（如舞蹈、绘画、健身），并分享“低投入启动方案”和想要验证的假设。\n\n实验报告：在体验后发布复盘，总结“开销”、“是否推荐尝试”以及“无形收获”（如技能、装备、新朋友）等', '……'],
  ];
  const bloggerRows = [
    ['账号定位', '“打工人下班后高质量独处与快乐恢复”的生活实验指南', '为想辞又不敢辞的职场女性带来情绪共鸣，输出高品质独处生活的实操干货', '用极度接地气的吃喝拉撒和碎碎念，打造了普通人最向往的“无压力、不装腔”的赛博避风港。'],
    ['差异化', '连载式系列化+反常规“抽象治愈”+超强视觉锤+满级情绪价值', '完美结合了“叛逆感”与“现实感”，用极其真实的流水账Vlog和干货分享，精准收割广深职场女性共鸣的“互联网替身”', '“糙汉子+低能量宅女”的强烈反差，消解了传统精致Vlog的做作，构成了极强的“抽象派”记忆点'],
    ['人设', '独居打工人；有趣、真实、略带抽象的“生活实验家”', '数字连续剧人设；“不上班但没摆烂”的生活家', '低能量i人、独居、不修边幅、热爱生活但爱拖延'],
    ['封面规律提炼', '1、主标题：大字号+固定引子“除了刷手机......”；\n2、固定副标题：编号+具体事项；\n3、配图中心突出一个极具画面感的主体', '1、固定标签：[年龄] + 裸辞 + 不上班不结婚 + 存款[XX]W + 在深圳gap[X]年\n2、视觉呈现：人物出镜（车内视角/第一视角）、高清晰度、画面上大字加粗，直击痛点\n3、标题规律：场景描述+情绪表达', '1、固定标签：[年龄] + 裸辞 + 不上班不结婚 + 存款[XX]W + 在深圳gap[X]年\n2、视觉呈现：人物出镜（车内视角/第一视角）、高清晰度、画面上大字加粗，直击痛点\n3、标题规律：场景描述+情绪表达'],
    ['内容策略', '1、情绪钩子/玩梗引入\n2、落地执行/干货输出\n3、体验反馈/情绪升华\n4、固定尾部', '1、特定开场白\n2、三餐打卡\n3、核心内容深入\n4、标签矩阵', '1、60%情绪日常\n2、30%场景化软种草\n3、10%情绪感悟'],
  ];
  const contentRows = [
    ['使用', '标题', ''],
    ['✅', '下班后恢复能量的100件小事（第X件）：xxxx', ''],
    ['', '下班后的一小时，决定了你这一天的快乐指数（高质量回血清单）', ''],
    ['✅', '沉浸式周末独居｜用一顿火锅和一场大扫除，杀死拖延症', ''],
    ['', '报告宝宝老师！今天下班后的流水账日记，又充实又废柴', ''],
    ['', '低能量i人的周末充电：不社交、不精致，纯过日子人实录', ''],
  ];

  return <section className="project-modal explore-second-page" aria-label="个人探索2-1">
    <button className="project-modal-close" type="button" onClick={onClose} aria-label="关闭个人探索2-1"><img src={assets.iconClose} alt="关闭" draggable="false" /></button>
    <div className="brand-page-scroll explore-second-scroll"><div className="brand-page-viewport" style={{ height: px(totalHeight * scale) }}><div className="brand-page-frame explore-second-frame" style={{ transform: `translateX(-50%) scale(${scale})`, height: totalHeight }}>
      <BrandImage name="xhs-top-bg" src={assets.xhsTopBg} style={{ left: 0, top: 0, width: 1280, height: 526 }} />
      <TextLayer name="0-1起号方法论" className="xhs-hero-title" style={{ left: 112, top: 235 }}>0-1起号方法论</TextLayer>
      <section className="xhs-section xhs-section-b"><XhsNav active={0} /><BrandImage name="prompt11" src={assets.xhsPrompt11} style={{ left: 245.09, top: 0, width: 914.74, height: 216 }} /><div className="xhs-down">……</div><img className="xhs-big-down" src={assets.iconDown} alt="" /><XhsTable className="xhs-direction-table" headers={['方向一', '方向二', '方向三']} rows={directionRows} /></section>
      <section className="xhs-section xhs-section-c"><XhsNav active={1} /><XhsTable className="xhs-blogger-table" firstHeader="博主账号" headers={['@木木花下班后', '@罗OK不想上班', '@凑活活']} rows={bloggerRows} /></section>
      <section className="xhs-section xhs-section-d"><XhsNav active={2} /><XhsTable className="xhs-content-table" firstHeader="体验生活" headers={['吃喝探店', '自我成长']} rows={contentRows} /></section>
      <section className="xhs-section xhs-section-e"><XhsNav active={3} /><div className="xhs-placeholder-column" /><div className="xhs-placeholder-column" /><div className="xhs-placeholder-column" /></section>
    </div></div></div>
  </section>;
}

const waterfallColumns = [
  { name: 'Waterfall1', left: 54, top: -25, loopHeight: 786, duration: 19, cards: [[111, 95, 'waterfall1_1'], [231, 215, 'waterfall1_2'], [207, 191, 'waterfall1_3'], [207, 191, 'waterfall1_4']] },
  { name: 'Waterfall2', left: 223, top: -67, loopHeight: 795, duration: 23, cards: [[231, 215, 'waterfall2_1'], [231, 215, 'waterfall2_2'], [96, 80, 'waterfall2_3'], [207, 191, 'waterfall2_4']] },
  { name: 'Waterfall3', left: 392, top: -45, loopHeight: 786, duration: 21, cards: [[111, 95, 'waterfall3_1'], [207, 191, 'waterfall3_2'], [231, 215, 'waterfall3_3'], [207, 191, 'waterfall3_4']] },
  { name: 'Waterfall4', left: 561, top: -67, loopHeight: 849, duration: 26, cards: [[207, 191, 'waterfall4_1'], [231, 215, 'waterfall4_2'], [270, 254, 'waterfall4_3'], [111, 95, 'waterfall4_4']] },
  { name: 'Waterfall5', left: 730, top: -67, loopHeight: 823, duration: 22, cards: [[111, 95, 'waterfall5_1'], [207, 191, 'waterfall5_2'], [123, 107, 'waterfall5_3'], [231, 215, 'waterfall5_4'], [111, 95, 'waterfall5_5']] },
  { name: 'Waterfall6', left: 899, top: -4, loopHeight: 1003, duration: 29, cards: [[207, 191, 'waterfall6_1'], [111, 95, 'waterfall6_2'], [207, 191, 'waterfall6_3'], [231, 215, 'waterfall6_4'], [207, 191, 'waterfall6_5']] },
  { name: 'Waterfall7', left: 1068, top: -67, loopHeight: 931, duration: 24, cards: [[111, 95, 'waterfall7_1'], [231, 215, 'waterfall7_2'], [207, 191, 'waterfall7_3'], [231, 215, 'waterfall7_4'], [111, 95, 'waterfall7_5']] },
];

function WaterfallColumn({ column, trackRef }) {
  return (
    <div
      className="personal-waterfall-column"
      data-layer={column.name}
      style={{ left: column.left, top: column.top, '--waterfall-loop': `${column.loopHeight}px`, '--waterfall-offset': `-${column.loopHeight}px`, '--waterfall-duration': `${column.duration}s` }}
    >
      <div ref={trackRef} className="personal-waterfall-track">
        {[0, 1].map((copy) => (
          <React.Fragment key={copy}>
            {column.cards.map(([height, imageHeight, imageName], index) => (
              <div
                className="personal-waterfall-card"
                data-layer={`${column.name}-${index + 1}`}
                key={`${copy}-${imageName}`}
                style={{ top: column.cards.slice(0, index).reduce((sum, [cardHeight]) => sum + cardHeight + 10, 0) + copy * column.loopHeight, height }}
              >
                <img src={assets[imageName]} alt="" draggable="false" style={{ width: 143, height: imageHeight }} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ExploreWaterfallPage({ onClose }) {
  const scale = useCanvasScale();
  const totalHeight = 717;
  const frameRef = useRef(null);
  const trackRefs = useRef([]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const offsets = waterfallColumns.map(() => 0);
    const wheelFactors = [1, 0.88, 1.08, 0.94, 1.12, 0.9, 1.04];
    const manualUntil = { value: 0 };
    let animationFrame;
    let previousTime = performance.now();

    const normalizeOffset = (value, loopHeight) => {
      const normalized = value % loopHeight;
      return normalized > 0 ? normalized - loopHeight : normalized;
    };

    const handleWheel = (event) => {
      event.preventDefault();
      manualUntil.value = performance.now() + 900;
      const delta = Math.max(-120, Math.min(120, event.deltaY));
      waterfallColumns.forEach((column, index) => {
        offsets[index] = normalizeOffset(offsets[index] - delta * wheelFactors[index], column.loopHeight);
      });
    };

    const tick = (now) => {
      const elapsed = Math.min(now - previousTime, 80);
      previousTime = now;
      if (now >= manualUntil.value) {
        waterfallColumns.forEach((column, index) => {
          offsets[index] = normalizeOffset(offsets[index] - (column.loopHeight / column.duration) * (elapsed / 1000), column.loopHeight);
        });
      }
      trackRefs.current.forEach((track, index) => {
        if (track) track.style.transform = `translate3d(0, ${offsets[index]}px, 0)`;
      });
      animationFrame = requestAnimationFrame(tick);
    };

    frame.addEventListener('wheel', handleWheel, { passive: false });
    animationFrame = requestAnimationFrame(tick);

    return () => {
      frame.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="spa-project-page explore-waterfall-page" data-frame="个人探索2-2" aria-label="个人探索2-2">
      <button className="project-modal-close" type="button" onClick={onClose} aria-label="关闭个人探索2-2">
        <img src={assets.iconClose} alt="关闭" draggable="false" />
      </button>
      <div className="brand-page-scroll personal-waterfall-scroll">
        <div className="brand-page-viewport" style={{ height: px(totalHeight * scale) }}>
          <div ref={frameRef} className="brand-page-frame personal-waterfall-frame" style={{ transform: `translateX(-50%) scale(${scale})`, height: totalHeight }}>
            {waterfallColumns.map((column, index) => <WaterfallColumn key={column.name} column={column} trackRef={(node) => { trackRefs.current[index] = node; }} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function CoffeeSectionHeading({ number, title, step, left, top }) {
  return (
    <div className="coffee-section-heading" style={{ left, top }}>
      <span className="coffee-section-number">{number}</span>
      <span className="coffee-section-title">{title}</span>
      <span className="coffee-section-step"><img src={assets.iconRight} alt="" />{step}</span>
    </div>
  );
}

function CoffeeStepCard({ className, title, children }) {
  return (
    <div className={`coffee-step-card ${className}`}>
      <div className="coffee-step-card-title">{title}</div>
      {children}
    </div>
  );
}

function CoffeeBrandOperationPage({ onClose }) {
  const scale = useCanvasScale();
  const totalHeight = 9645;

  return (
    <section className="spa-project-page coffee-operation-page" data-frame="AI/运营3-3" aria-label="AI/运营3-3">
      <button className="project-modal-close" type="button" onClick={onClose} aria-label="关闭AI/运营3-3">
        <img src={assets.iconClose} alt="关闭" draggable="false" />
      </button>
      <div className="brand-page-scroll coffee-page-scroll">
        <div className="brand-page-viewport coffee-page-viewport" style={{ height: px(totalHeight * scale) }}>
          <div className="brand-page-frame coffee-page-frame" style={{ transform: `translateX(-50%) scale(${scale})`, height: totalHeight }}>
            <BrandImage name="brand-top-bg" src={assets.brandTopBg} style={{ left: 0, top: 0, width: 1280, height: 717 }} />

            <section className="coffee-section-a">
              <CoffeeSectionHeading number="1" title="策略和洞察" step="STEP 1   用户洞察" left={0} top={0} />
              <div className="coffee-analysis" style={{ left: 15, top: 161 }}>
                <BrandText name="现有品牌分析" className="coffee-label">现有品牌分析</BrandText>
                <BrandImage name="chart1" src={assets.coffeeChart1} style={{ left: 0, top: 36, width: 1090, height: 132 }} />
              </div>
              <div className="coffee-positioning" style={{ left: 15, top: 385 }}>
                <BrandText name="品牌定位" className="coffee-label">品牌定位</BrandText>
                <BrandText name="品牌定位描述" className="coffee-copy">“非社交型”打工人情绪缓冲咖啡空间。区别于星巴克的“第三空间”（社交导向）和 Manner 的“快取效率”，OK Coffee 明确定位于“反社交”的独处 sanctuary。<br /><br />核心主张：用一杯不催促、不打扰的温柔，承接住所有“好的”“ok”背后，那个想发呆、想放空、想暂时“已读不回”的你。<br /><br />• 不卖空间社交，卖情绪隔离<br />• 不追求翻台率，追求停留的正当性<br />• 不是“来聊聊”，是“来缓缓”</BrandText>
              </div>
              <div className="coffee-intro" style={{ left: 15, top: 621 }}>
                <BrandText name="品牌简介" className="coffee-label">品牌简介</BrandText>
                <BrandText name="品牌简介描述" className="coffee-intro-copy">“OK”Coffee，是打工人在无数句“收到”之后，给自己按下的一枚暂停键——不用社交、不用营业，让没说出口的累，在一杯咖啡的时间稍得缓冲。</BrandText>
              </div>
              <div className="coffee-slogan" style={{ left: 14, top: 737 }}>
                <BrandText name="品牌Slogan" className="coffee-label">品牌Slogan</BrandText>
                <BrandText name="品牌Slogan描述" className="coffee-slogan-copy">累了，丧了，不想干了，都OK</BrandText>
              </div>
              <div className="coffee-keywords" style={{ left: 15, top: 821 }}>
                <BrandText name="品牌关键词" className="coffee-label">品牌关键词</BrandText>
                {[
                  ['情绪', '用一杯不催促、不打扰的温柔，承接住“好的”“ok”背后，那个想发呆、暂时“已读不回”的你'],
                  ['共鸣', '品牌元素延展源自打工人最熟悉的职场场景，结合热梗，引发消费者的共鸣'],
                  ['松弛', '品牌像一条未发送的微信——所有人都懂，但不必说出口，传递一种“随便吧，先活着”的松弛'],
                ].map(([keyword, copy]) => <div className="coffee-keyword" key={keyword}><span>{keyword}</span><p>{copy}</p></div>)}
              </div>
            </section>

            <section className="coffee-section-b">
              <BrandText name="STEP 2 确定视觉体系" className="coffee-step-heading"><img src={assets.iconRight} alt="" />STEP 2　确定视觉体系</BrandText>
              <div className="coffee-swatches">
                <div className="coffee-swatch blue">#BBD7EC</div><div className="coffee-swatch brown">#4C2B08</div><div className="coffee-swatch yellow">#F4F3C3</div>
              </div>
              <div className="coffee-theme-copy"><BrandText name="品牌主题色" className="coffee-label">品牌主题色</BrandText><BrandText name="主题色描述" className="coffee-copy">品牌色彩搭配融合了雾霾蓝、温柔的奶油黄和丰富的咖啡豆原色，雾霾蓝像周一早上窗外的天，灰蒙蒙的，呼应打工人疲惫、略丧的心情。奶油黄是咖啡注入的充能能量，温柔接住打工人的情绪缓冲。<br /><br />品牌灵感源自打工人最熟悉的职场日常——“好的”“ok”“收到”。这不是敷衍，而是当代职场人每天重复数十次的生存暗号。品牌本身即是一种情绪共鸣符号：当你走进 OK Coffee，意味着你终于可以对工作群说一次“ok，但先让我喝完这杯”，在忙碌之余获得片刻缓冲。</BrandText></div>
              <BrandImage name="coffeescene1" src={assets.coffeeScene1} style={{ left: 0, top: 421, width: 1090, height: 618 }} />
            </section>

            <section className="coffee-section-c">
              <CoffeeSectionHeading number="2" title="执行与创意" step="主产品设计" left={12} top={0} />
              <CoffeeStepCard className="coffee-step-one" title="· STEP 1：灵感溯源"><BrandImage name="prompt4" src={assets.coffeePrompt4} style={{ left: 8, top: 62, width: 143, height: 76 }} /><BrandText name="prompt4-copy" className="coffee-prompt-copy" style={{ left: 8, top: 38, width: 344, height: 20 }}>生成一个拿着咖啡杯的卡通人物上半身形象，人物手势呈现“ok”的姿势，表情特色体现出一种平淡的感觉，扁平插画风格，不需要添加过多细节…</BrandText><BrandText name="step1-content" className="coffee-step-copy" style={{ left: 8, top: 150, width: 352, height: 42 }}><strong>处理内容：</strong>生成符合品牌调性的LOGO基础形态，导入 ILLUSTRATOR 中进行细化调整。</BrandText><BrandText name="step1-tools" className="coffee-tool-copy" style={{ left: 8, top: 204 }}><strong>应用工具：</strong>CHATGPT+ILLUSTRATOR</BrandText></CoffeeStepCard>
              <CoffeeStepCard className="coffee-step-two" title="· STEP 2：形象延展"><BrandImage name="prompt5" src={assets.coffeePrompt5} style={{ left: 8, top: 38, width: 344, height: 142 }} /><BrandImage name="prompt6" src={assets.coffeePrompt6} style={{ left: 360, top: 38, width: 425, height: 130 }} /><BrandText name="step2-content" className="coffee-step-copy" style={{ left: 8, top: 192, width: 597 }}><strong>处理内容：</strong>生成品牌LOGO形象延展，导入 AI 中进行细化调整，统一图片质感和尺寸。</BrandText><BrandText name="step2-tools" className="coffee-tool-copy" style={{ left: 8, top: 218 }}><strong>应用工具：</strong>CHATGPT+ILLUSTRATOR</BrandText></CoffeeStepCard>
              <CoffeeStepCard className="coffee-step-three" title="· STEP3：平面转真实产品图"><BrandImage name="prompt7" src={assets.coffeePrompt7} style={{ left: 8, top: 38, width: 361, height: 153 }} /><BrandImage name="prompt8" src={assets.coffeePrompt8} style={{ left: 373, top: 38, width: 362, height: 153 }} /><BrandText name="step3-content" className="coffee-step-copy" style={{ left: 8, top: 203, width: 426 }}><strong>处理内容：</strong>提示词生成真实商业产品摄影图，PHOTOSHOP 处理细节</BrandText><BrandText name="step3-tools" className="coffee-tool-copy" style={{ left: 8, top: 229 }}><strong>应用工具：</strong>CHATGPT+即梦+PHOTOSHOP</BrandText></CoffeeStepCard>
              <BrandImage name="logo" src={assets.coffeeLogo} style={{ left: 922, top: 423, width: 214, height: 223 }} />
              <BrandImage name="icon-down" src={assets.iconDown} style={{ left: 825, top: 523, width: 24, height: 24, transform: 'rotate(-90deg)' }} />
              <BrandImage name="cup" src={assets.coffeeCup} style={{ left: 83, top: 968, width: 211, height: 238 }} />
              <BrandImage name="paper" src={assets.coffeePaper} style={{ left: 393, top: 814, width: 233.09, height: 392 }} />
              <BrandImage name="bag" src={assets.coffeeBag} style={{ left: 723, top: 709, width: 351.75, height: 497 }} />
            </section>

            {[
              ['coffeescene2', assets.coffeeScene2, 4282, 717], ['coffeescene3', assets.coffeeScene3, 4999, 1606],
              ['coffeescene4', assets.coffeeScene4, 6605, 1606], ['coffeescene5', assets.coffeeScene5, 8211, 717], ['coffeescene6', assets.coffeeScene6, 8928, 717],
            ].map(([name, src, top, height]) => <BrandImage key={name} name={name} src={src} style={{ left: 0, top, width: 1280, height }} />)}
            <div className="coffee-scene-label" style={{ top: 4322 }}><img src={assets.iconRight} alt="" />场景应用</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UxSectionHeading({ number, title, english, left, top }) {
  return (
    <div className="ux-section-heading" style={{ left, top }}>
      <span className="ux-section-number">{number}</span>
      <span className="ux-section-title">{title}</span>
      <span className="ux-section-english">{english}</span>
    </div>
  );
}

function UxStepHeading({ children }) {
  return <div className="ux-step-heading"><img src={assets.iconRight} alt="" />{children}</div>;
}

function UxUiSecondPage({ onClose }) {
  const scale = useCanvasScale();
  const totalHeight = 9430;
  const backgroundCards = [
    ['01', '政策', '驱动', '民政部、商务部于 2025.7-12月举办全国“养老服务消费季”，以“惠老助老、品质生活”为主题，促进养老服务消费、提升老年人生活品质。', assets.uxIconPolicy],
    ['02', '市场', '趋势', '银发经济成为新赛道。养老机构、适老产品、特色服务、老年教育、智能设备等多业态亟需整合，形成统一的消费入口与品牌认知。', assets.uxIconTrend],
    ['03', '市场', '洞察', '子女端需要“一键备齐父母所需”，追求省心与优惠；老年端需要看得清、点得动、可信赖的适老化体验，对复杂操作容忍度低。', assets.uxIconOlder],
  ];
  const objectives = [
    ['招', '招商', '引资', '吸引优质养老企业与服务商入驻，拓展全品类商户，丰富产品种类，预计引进优质商家 30 家以上。', assets.uxIconPeople],
    ['传', '扩大', '影响', '通过线上线下多渠道宣传，提升活动知晓度，实现全域宣传覆盖 50 万人次，新增注册用户 1.2 万+。', assets.uxIconNoticeL],
    ['消', '促进', '消费', '拉动养老服务消费，重点带动适老产品、特色服务、智能设备等高频品类转化。', assets.uxIconHome],
  ];
  const plans = [
    ['爆点传播 · 活动Banner', '• 面向子女端：孝心不砍价，优惠帮你砍\n• 面向商户端：入驻即享优先曝光\n• 统一主视觉延展全渠道尺寸', assets.uxBannerThumbnail],
    ['门店宣传 · KT板', '• 展示三步用券指南：扫码▶领券▶出示码\n• 货架价签“颐养补贴价”红色标识\n• 适配营业厅、合作门店落地', assets.uxKtThumbnail],
    ['线上宣传 · H5活动页', '• 品类通用券 / 店铺通用券 / 单品券\n• 子女代领 + 亲情账户绑定入口\n• 适老化大字版交互与操作引导', assets.uxH5Thumbnail],
  ];
  const styles = [
    ['A', '暖橙生活 · 3D 亲和', '以橙金与奶油白为主，圆润 3D 家居场景，子女陪伴父母，传递“有温度、可信赖”的养老服务感知，亲和力强。', assets.uxStyleA],
    ['B', '蓝红碰撞 · 玻璃科技3D微观', '蓝红撞色，真实产品质感与玻璃/亚克力材质结合，微观景观场景（购物车、悬浮产品、微缩城市），电商大促氛围，科技感强', assets.uxStyleB],
    ['C', '东方水墨 · 新中式淡雅', '米白底，水墨山水、楼阁小船、松鹤，淡橙与墨色交织，文化感强，留白多，适合颐养生活主题与情感传播。', assets.uxStyleC],
  ];

  return (
    <section className="spa-project-page ux-ui-second-page" data-frame="UX/UI 2-1" aria-label="UX/UI 2-1">
      <button className="project-modal-close" type="button" onClick={onClose} aria-label="关闭UX/UI 2-1"><img src={assets.iconClose} alt="关闭" draggable="false" /></button>
      <div className="brand-page-scroll ux-ui-page-scroll">
        <div className="brand-page-viewport ux-ui-page-viewport" style={{ height: px(totalHeight * scale) }}>
          <div className="brand-page-frame ux-ui-page-frame" style={{ transform: `translateX(-50%) scale(${scale})`, height: totalHeight }}>
            <BrandImage name="nourish-top-bg" src={assets.uxNourishTopBg} style={{ left: 0, top: 0, width: 1280, height: 717 }} />

            <section className="ux-background-section">
              <UxSectionHeading number="1" title="背景分析" english="BACKGROUND" left={0} top={0} />
              <div className="ux-three-cards ux-background-cards">
                {backgroundCards.map(([index, lead, title, copy, icon]) => <div className="ux-background-card" key={index}><span className="ux-card-index">{index}</span><BrandImage name={`icon-${title}`} src={icon} style={{ left: 65, top: 20, width: 221, height: 139 }} /><div className="ux-card-title"><em>{lead}</em>{title}</div><p>{copy}</p></div>)}
              </div>
              <div className="ux-summary"><BrandImage name="icon-notice" src={assets.uxIconNotice} style={{ left: 16, top: 11, width: 61, height: 42 }} /><span>“幸福颐养超市”平台承接本次消费季落地，需要一套统一、可信、有温度的视觉语言，同时打通商户端招商与用户端消费两条传播链路。</span></div>
            </section>

            <section className="ux-objective-section">
              <UxSectionHeading number="2" title="项目目的与设计目标" english="OBJECTIVE" left={0} top={0} />
              <div className="ux-three-cards ux-objective-cards">
                {objectives.map(([letter, lead, title, copy]) => <div className="ux-objective-card" key={letter}><span className="ux-objective-icon">{letter}</span><div className="ux-card-title"><em>{lead}</em>{title}</div><p>{copy}</p></div>)}
              </div>
              <div className="ux-objective-summary"><strong>设计侧目标</strong><span>以“品质养老 + 实惠消费”为核心视觉表达，用一套统一的视觉系统承载招商、宣发、转化三大任务 —— 提案效率提升 45%，素材创作效率提升 40%。</span></div>
              <div className="ux-metrics">
                <div className="ux-metric"><BrandImage name="icon-home" src={assets.uxIconHome} style={{ left: 0, top: 0, width: 102, height: 102 }} /><strong>30</strong><em>家+</em><span>优质商户目标</span></div>
                <i /><div className="ux-metric"><BrandImage name="icon-people" src={assets.uxIconPeople} style={{ left: 0, top: 0, width: 102, height: 102 }} /><strong>50</strong><em>万+</em><span>宣传覆盖人次</span></div>
                <i /><div className="ux-metric"><BrandImage name="icon-photo" src={assets.uxIconPhoto} style={{ left: 0, top: 0, width: 102, height: 102 }} /><strong>30</strong><em>+</em><span>视觉物料产出</span></div>
              </div>
            </section>

            <section className="ux-process-section">
              <UxSectionHeading number="3" title="项目执行与落地" english="ACTION" left={0} top={0} />
              <UxStepHeading>STEP1 设计流程拆解</UxStepHeading>
              <div className="ux-process-flow">
                {[[assets.uxIconDemand, '需求拆解', '明确活动目标、双端受众与物料清单'], [assets.uxIconStyle, '风格探索', '运用AI生成多版本图，快速收敛主视觉调性'], [assets.uxIconBanner, '物料产出', '独立策划并统筹 banner、活动页、详情页等 30+ 物料'], [assets.uxIconNoticeL, '宣发落地', '联动多方执行宣传计划、折扣配置与效果回收']].map(([icon, title, copy], index) => <React.Fragment key={title}><div className="ux-process-item"><BrandImage name={title} src={icon} style={{ left: 54, top: 0, width: 90, height: 90 }} /><strong>{title}</strong><span>{copy}</span></div>{index < 3 && <img className="ux-flow-arrow" src={assets.iconDown} alt="" />}</React.Fragment>)}
              </div>
              <div className="ux-summary ux-process-summary"><BrandImage name="icon-target" src={assets.uxIconTarget} style={{ left: 36, top: 14, width: 42, height: 35 }} /><span>流程中引入 AI 批量生成多版本标题与促销文案，配合人工筛选定稿， 将素材创作周期显著压缩，效率提升 40%。</span></div>
            </section>

            <section className="ux-plan-section"><UxStepHeading>STEP2 活动宣发规划</UxStepHeading><div className="ux-plan-cards">{plans.map(([title, copy, image]) => <div className="ux-plan-card" key={title}><BrandImage name={title} src={image} style={{ left: 0, top: 0, width: 350, height: 194 }} /><strong>{title}</strong><p>{copy}</p></div>)}</div></section>

            <section className="ux-style-section"><UxStepHeading>STEP 3　设计风格探索</UxStepHeading><div className="ux-style-flow"><b className="ux-style-flow-bracket ux-style-flow-open">（</b>{['风格定义', '关键词提取', '细节把控', '主视觉产出'].map((item, index) => <React.Fragment key={item}><span>{item}</span>{index < 3 && <img src={assets.iconDown} alt="" />}</React.Fragment>)}<b className="ux-style-flow-bracket ux-style-flow-close">）</b></div><div className="ux-style-options">{styles.map(([letter, title, copy, image]) => { const imageStyle = letter === 'A' ? { left: -27, top: -33, width: 429, height: 241 } : letter === 'B' ? { left: -12, top: 0, width: 393, height: 221 } : { left: -5, top: -8, width: 392, height: 220 }; return <div className="ux-style-option" key={letter}><b>{letter}</b><strong>{title}</strong><p>{copy}</p><div className="ux-style-image-frame"><BrandImage name={`style${letter}`} src={image} style={imageStyle} /></div></div>; })}</div><div className="ux-style-analysis"><b>A</b><strong className="ux-style-analysis-title">风格确定</strong><div className="ux-style-analysis-copy"><p><strong>01 色彩心理与适老化视觉：</strong><span>研究指出，暖色调、高亮度、中等饱和度的配色最适合老年用户，能有效缓解视觉疲劳。</span></p><p><strong>02 平台调性与场景适配：</strong><span>方案A与移动端平台扁平化设计语言高度统一，最契合平台首页的温暖基调</span></p><p><strong>03转化效率与传播成本：</strong><span>方案A与现有平台视觉资产复用率最高，物料延展成本最低</span></p></div></div><div className="ux-summary ux-style-summary"><strong>设计侧目标</strong><span>以“品质养老 + 实惠消费”为核心视觉表达，用一套统一的视觉系统承载 招商、宣发、转化三大任务 —— 提案效率提升 45%，素材创作效率提升 40%。</span></div><BrandImage name="sectionF-icon-down" src={assets.iconDown} style={{ left: 533, top: 990, width: 24, height: 24 }} /></section>

            <section className="ux-prompt-section"><UxStepHeading>STEP 4 抽卡过程</UxStepHeading><h3>主KV提示词</h3><BrandText name="主KV提示词文本" className="ux-prompt-copy" style={{ left: 16, top: 92, width: 580, height: 239 }}>3D cartoon style, warm orange and cream palette, a kind silver-haired grandmother and her middle-aged daughter in a cozy living room, daughter showing mobile phone with elderly care services, grandmother smiling and giving a thumbs up, floating coupons, hearts, shopping bags, elderly care icons, family companionship and shopping scene, 16:9 horizontal composition, centered but with copy space on the right, C4D render, matte frosted soft rubber texture, soft studio lighting, rounded shapes, pop mart style, warm healing commercial KV.</BrandText><BrandImage name="prompt9" src={assets.uxPrompt9} style={{ left: 687, top: 60, width: 403, height: 212 }} /><h3 className="ux-prompt-subtitle">多次抽卡</h3><BrandImage name="prompt10" src={assets.uxPrompt10} style={{ left: 0, top: 427, width: 1090, height: 452 }} /></section>

            <section className="ux-visual-section"><UxStepHeading>STEP 5 视觉优化过程</UxStepHeading><div className="ux-visual-theme"><strong>第一步 选择主题</strong><span>生成并选择合适的主体形象</span><BrandImage name="主KV" src={assets.uxMainKv} style={{ left: 0, top: 72, width: 250, height: 306 }} /><BrandImage name="character" src={assets.uxCharacter} style={{ left: 250, top: 138, width: 159, height: 240 }} /></div><div className="ux-visual-scene"><strong>第二步 选择背景图</strong><span>生成并拓展背景场景图</span><BrandImage name="nourish-scene" src={assets.uxNourishScene} style={{ left: 0, top: 72, width: 566, height: 283 }} /></div><div className="ux-visual-edit"><strong>第三步 PS修改+最终排版</strong><span>细节修改+添加文案</span><BrandImage name="ps-edit" src={assets.uxPsEdit} style={{ left: 0, top: 72, width: 1090, height: 506 }} /></div></section>

            <section className="ux-showcase-section"><UxSectionHeading number="4" title="物料展示" english="SHOWCASE" left={0} top={0} /><h3>H5活动页</h3><BrandImage name="H5-detail" src={assets.uxH5Detail} style={{ left: 46, top: 165, width: 530, height: 1222 }} /><div className="ux-showcase-line ux-showcase-line-1" /><div className="ux-showcase-line ux-showcase-line-2" /><div className="ux-showcase-line ux-showcase-line-3" /><div className="ux-showcase-line ux-showcase-line-4" /><div className="ux-showcase-line ux-showcase-line-5" /><div className="ux-showcase-line ux-showcase-line-vertical" /><div className="ux-showcase-notes"><div className="ux-showcase-note-1"><strong>主视觉区</strong><p>用圆润字体、卡通人物结合康养产品，吸引用户注意力清晰传达活动主题“颐养生活消费季”，建立活动氛围感。</p></div><div className="ux-showcase-note-2"><strong>活动时间区</strong><p>活动整体概述，让用户一眼清楚活动主题和起止时间。</p></div><div className="ux-showcase-note-3"><strong>活动介绍区</strong><p>面向商家、老年用户、大众用户三类群体，分类介绍主要活动内容，增加用户参与度和活动传播度</p></div><div className="ux-showcase-note-4"><strong>活动参与及规则区</strong><p>引导用户扫码查看活动详情，引流至官方平台。活动规则简洁列出解释权归属，规范活动秩序，保障活动有序开展</p></div></div></section>

            <section className="ux-material-section"><h3>活动banner</h3><BrandImage name="banner1" src={assets.uxBanner1} style={{ left: 0, top: 46, width: 506, height: 215 }} /><BrandImage name="banner2" src={assets.uxBanner2} style={{ left: 522, top: 46, width: 506, height: 215 }} /><BrandImage name="banner3" src={assets.uxBanner3} style={{ left: 0, top: 277, width: 506, height: 215 }} /><BrandImage name="banner4" src={assets.uxBanner4} style={{ left: 522, top: 277, width: 506, height: 215 }} /><h3 className="ux-material-kt-title">门店KT板</h3><BrandImage name="kt板-detail" src={assets.uxKtDetail} style={{ left: 0, top: 594, width: 555, height: 1113 }} /><BrandImage name="store-scene" src={assets.uxStoreScene} style={{ left: 571, top: 594, width: 457, height: 610 }} /><BrandImage name="standee" src={assets.uxStandee} style={{ left: 676, top: 1220, width: 248, height: 372 }} /><BrandImage name="price-tag" src={assets.uxPriceTag} style={{ left: 686, top: 1593, width: 228, height: 114 }} /></section>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [isAiOperationPageOpen, setIsAiOperationPageOpen] = useState(false);
  const [isAiOperationFolderOpen, setIsAiOperationFolderOpen] = useState(false);
  const [isAiOperationBrandOpen, setIsAiOperationBrandOpen] = useState(false);
  const [isAiOperationPosterOpen, setIsAiOperationPosterOpen] = useState(false);
  const [isAiOperationCoffeeOpen, setIsAiOperationCoffeeOpen] = useState(false);
  const [isUxUiSecondOpen, setIsUxUiSecondOpen] = useState(false);
  const [isExploreSecondOpen, setIsExploreSecondOpen] = useState(false);
  const [isExploreWaterfallOpen, setIsExploreWaterfallOpen] = useState(false);

  useEffect(() => {
    if (!isAiOperationPageOpen && !isAiOperationFolderOpen && !isAiOperationBrandOpen && !isAiOperationPosterOpen && !isAiOperationCoffeeOpen && !isUxUiSecondOpen && !isExploreSecondOpen && !isExploreWaterfallOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isAiOperationPageOpen, isAiOperationFolderOpen, isAiOperationBrandOpen, isAiOperationPosterOpen, isAiOperationCoffeeOpen, isUxUiSecondOpen, isExploreSecondOpen, isExploreWaterfallOpen]);

  const pages = useMemo(
    () => [Home, TransitionAboutAi],
    [],
  );

  const openAiOperationProject = () => {
    setIsAiOperationPageOpen(true);
  };

  const closeAiOperationProject = () => {
    setIsAiOperationPageOpen(false);
  };

  return (
    <main>
      {pages.map((Page, index) => (
        <Page
          key={Page.name || pageMap[index].id}
          onOpenProject={openAiOperationProject}
          onOpenFolder={() => setIsAiOperationFolderOpen(true)}
          onOpenUxUiSecond={() => setIsUxUiSecondOpen(true)}
          onOpenExploreSecond={() => setIsExploreSecondOpen(true)}
          onOpenExploreWaterfall={() => setIsExploreWaterfallOpen(true)}
        />
      ))}
      {isAiOperationPageOpen ? <AiOperationProjectPage onClose={closeAiOperationProject} /> : null}
      {isAiOperationFolderOpen ? (
        <AiOperationFolderPage
          onClose={() => setIsAiOperationFolderOpen(false)}
          onOpenBrand={() => setIsAiOperationBrandOpen(true)}
          onOpenPoster={() => setIsAiOperationPosterOpen(true)}
          onOpenCoffee={() => setIsAiOperationCoffeeOpen(true)}
        />
      ) : null}
      {isAiOperationBrandOpen ? <BrandOperationPage onClose={() => setIsAiOperationBrandOpen(false)} /> : null}
      {isAiOperationPosterOpen ? <PosterOperationPage onClose={() => setIsAiOperationPosterOpen(false)} /> : null}
      {isAiOperationCoffeeOpen ? <CoffeeBrandOperationPage onClose={() => setIsAiOperationCoffeeOpen(false)} /> : null}
      {isUxUiSecondOpen ? <UxUiSecondPage onClose={() => setIsUxUiSecondOpen(false)} /> : null}
      {isExploreSecondOpen ? <ExploreSecondPage onClose={() => setIsExploreSecondOpen(false)} /> : null}
      {isExploreWaterfallOpen ? <ExploreWaterfallPage onClose={() => setIsExploreWaterfallOpen(false)} /> : null}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

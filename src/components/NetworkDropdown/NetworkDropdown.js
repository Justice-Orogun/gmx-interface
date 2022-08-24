import React, { useRef, useState } from "react";
import { Menu } from "@headlessui/react";
import ModalWithPortal from "../Modal/ModalWithPortal";
import { t } from "@lingui/macro";
import cx from "classnames";
import "./NetworkDropdown.css";
import language24Icon from "../../img/ic_language24.svg";
import settingsIcon from "../../img/ic_settings_16.svg";
import arbitrumIcon from "../../img/ic_arbitrum_24.svg";
import avaxIcon from "../../img/ic_avalanche_24.svg";
import checkedIcon from "../../img/ic_checked.svg";
import arrowright16Icon from "../../img/ic_arrowright16.svg";
import { importImage, isHomeSite, LANGUAGE_LOCALSTORAGE_KEY } from "../../Helpers";
import { defaultLocale, dynamicActivate, locales } from "../../utils/i18n";
import { IoOptionsSharp } from "react-icons/io5";

const LANGUAGE_MODAL_KEY = "LANGUAGE";
const NETWORK_MODAL_KEY = "NETWORK";

export default function NetworkDropdown(props) {
  const currentLanguage = useRef(localStorage.getItem(LANGUAGE_LOCALSTORAGE_KEY) || defaultLocale);
  const [activeModal, setActiveModal] = useState(null);
  return props.small ? (
    <MobileScreen
      currentLanguage={currentLanguage}
      activeModal={activeModal}
      setActiveModal={setActiveModal}
      {...props}
    />
  ) : (
    <DesktopScreen
      currentLanguage={currentLanguage}
      activeModal={activeModal}
      setActiveModal={setActiveModal}
      {...props}
    />
  );
}
function NavIcons({ selectorLabel }) {
  return (
    <>
      <button className={cx("btn-primary small transparent")}>
        <img
          className="network-dropdown-icon"
          src={selectorLabel === "Arbitrum" ? arbitrumIcon : avaxIcon}
          alt={selectorLabel}
        />
      </button>
      <div className="network-dropdown-seperator" />
      <button className={cx("btn-primary small transparent")}>
        <IoOptionsSharp color="white" size={20} />
      </button>
    </>
  );
}
function MobileScreen({
  activeModal,
  setActiveModal,
  currentLanguage,
  selectorLabel,
  networkOptions,
  onNetworkSelect,
  openSettings,
}) {
  async function handleNetworkSelect(option) {
    await onNetworkSelect(option);
  }
  return (
    <>
      <div className="App-header-network" onClick={() => setActiveModal(NETWORK_MODAL_KEY)}>
        <div className="network-dropdown">
          <NavIcons selectorLabel={selectorLabel} />
        </div>
      </div>
      <ModalWithPortal
        className="network-popup"
        isVisible={activeModal === NETWORK_MODAL_KEY}
        setIsVisible={() => setActiveModal(null)}
        label={t`Networks and Settings`}
      >
        <div className="network-dropdown-items">
          <div className="network-dropdown-list">
            {networkOptions.map((network) => {
              const networkIcon = importImage(network.icon);
              return (
                <div
                  className="network-option"
                  onClick={() => handleNetworkSelect({ value: network.value })}
                  key={network.value}
                >
                  <div className="menu-item-group">
                    <img src={networkIcon} alt={network.label} />
                    <span>{network.label}</span>
                  </div>
                  <div className={cx("active-dot", { [selectorLabel]: selectorLabel === network.label })} />
                </div>
              );
            })}
            <div
              className="network-option"
              onClick={() => {
                console.log("called");
                setActiveModal(LANGUAGE_MODAL_KEY);
              }}
            >
              <div className="menu-item-group">
                <img className="network-option-img" src={language24Icon} alt="Select Language" />
                <span className="network-option-img-label">Language</span>
              </div>
              <div className="menu-item-icon">
                <img src={arrowright16Icon} alt="arrow-right-icon" />
              </div>
            </div>
            <div
              className="network-option"
              onClick={() => {
                openSettings();
                setActiveModal(null);
              }}
            >
              <div className="menu-item-group">
                <img className="network-option-img" src={settingsIcon} alt="" />
                <span className="network-option-img-label">Settings</span>
              </div>
              <div className="menu-item-icon">
                <img src={arrowright16Icon} alt="arrow-right-icon" />
              </div>
            </div>
          </div>
        </div>
      </ModalWithPortal>
      <LanguageDropdown currentLanguage={currentLanguage} activeModal={activeModal} setActiveModal={setActiveModal} />
    </>
  );
}

function DesktopScreen({
  activeModal,
  setActiveModal,
  currentLanguage,
  selectorLabel,
  networkOptions,
  onNetworkSelect,
  openSettings,
}) {
  return (
    <>
      <div className="App-header-network">
        <Menu>
          <Menu.Button as="div" className="network-dropdown">
            <NavIcons selectorLabel={selectorLabel} />
          </Menu.Button>
          <Menu.Items as="div" className="menu-items network-dropdown-items">
            <div className="dropdown-label">Networks</div>
            <div className="network-dropdown-list">
              <NetworkMenuItems
                networkOptions={networkOptions}
                selectorLabel={selectorLabel}
                onNetworkSelect={onNetworkSelect}
              />
            </div>
            <div className="network-dropdown-divider" />
            <Menu.Item>
              <div className="network-dropdown-menu-item menu-item" onClick={openSettings}>
                <div className="menu-item-group">
                  <div className="menu-item-icon">
                    <img className="network-dropdown-icon" src={settingsIcon} alt="" />
                  </div>
                  <span className="network-dropdown-item-label">Settings</span>
                </div>
                <div className="menu-item-icon">
                  <img className="network-dropdown-icon" src={arrowright16Icon} alt="arrow-right-icon" />
                </div>
              </div>
            </Menu.Item>
            <Menu.Item>
              <div className="network-dropdown-menu-item menu-item" onClick={() => setActiveModal(LANGUAGE_MODAL_KEY)}>
                <div className="menu-item-group">
                  <div className="menu-item-icon">
                    <img className="network-dropdown-icon" src={language24Icon} alt="" />
                  </div>
                  <span className="network-dropdown-item-label">Language</span>
                </div>
                <div className="menu-item-icon">
                  <img className="network-dropdown-icon" src={arrowright16Icon} alt="arrow-right-icon" />
                </div>
              </div>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      <LanguageDropdown currentLanguage={currentLanguage} activeModal={activeModal} setActiveModal={setActiveModal} />
    </>
  );
}

function NetworkMenuItems({ networkOptions, selectorLabel, onNetworkSelect }) {
  async function handleNetworkSelect(option) {
    await onNetworkSelect(option);
  }
  return networkOptions.map((network) => {
    const networkIcon = importImage(network.icon);
    return (
      <Menu.Item key={network.value}>
        <div
          className="network-dropdown-menu-item menu-item"
          onClick={() => handleNetworkSelect({ value: network.value })}
        >
          <div className="menu-item-group">
            <div className="menu-item-icon">
              <img className="network-dropdown-icon" src={networkIcon} alt={network.label} />
            </div>
            <span className="network-dropdown-item-label">{network.label}</span>
          </div>
          <div className="network-dropdown-menu-item-img">
            <div className={cx("active-dot", { [selectorLabel]: selectorLabel === network.label })} />
          </div>
        </div>
      </Menu.Item>
    );
  });
}

function LanguageDropdown({ currentLanguage, activeModal, setActiveModal }) {
  return (
    <ModalWithPortal
      className="language-modal"
      isVisible={activeModal === LANGUAGE_MODAL_KEY}
      setIsVisible={() => setActiveModal(null)}
      label={t`Select Language`}
    >
      {Object.keys(locales).map((item) => {
        const image = importImage(`flag_${item}.svg`);
        return (
          <div
            key={item}
            className={cx("network-dropdown-menu-item  menu-item language-modal-item", {
              active: currentLanguage.current === item,
            })}
            onClick={() => {
              localStorage.setItem(LANGUAGE_LOCALSTORAGE_KEY, item);
              dynamicActivate(item);
            }}
          >
            <div className="menu-item-group">
              <div className="menu-item-icon">
                <img className="network-dropdown-icon" src={image} alt="language-menu-open-icon" />
              </div>
              <span className="network-dropdown-item-label menu-item-label">{locales[item]}</span>
            </div>
            <div className="network-dropdown-menu-item-img">
              {currentLanguage.current === item && <img src={checkedIcon} alt={locales[item]} />}
            </div>
          </div>
        );
      })}
    </ModalWithPortal>
  );
}

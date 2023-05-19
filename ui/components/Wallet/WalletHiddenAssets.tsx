import React, { ReactElement, useEffect, useRef, useState } from "react"
import { CompleteAssetAmount } from "@tallyho/tally-background/redux-slices/accounts"
import { useTranslation } from "react-i18next"
import classNames from "classnames"
import {
  selectShowHiddenAssets,
  toggleShowHiddenAssets,
} from "@tallyho/tally-background/redux-slices/ui"
import { SwappableAsset } from "@tallyho/tally-background/assets"
import WalletAssetList from "./WalletAssetList"
import SharedButton from "../Shared/SharedButton"
import { useBackgroundDispatch, useBackgroundSelector } from "../../hooks"
import { useIsMounted } from "../../hooks/react-hooks"
import SharedBanner from "../Shared/SharedBanner"

type WalletHiddenAssetsProps = {
  assetAmounts: CompleteAssetAmount<SwappableAsset>[]
}

export default function WalletHiddenAssets({
  assetAmounts,
}: WalletHiddenAssetsProps): ReactElement {
  const { t } = useTranslation("translation", {
    keyPrefix: "wallet",
  })
  const mountedRef = useIsMounted()
  const hiddenAssetsRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const [maxHeight, setMaxHeight] = useState(0)

  const dispatch = useBackgroundDispatch()
  const showHiddenAssets = useBackgroundSelector(selectShowHiddenAssets)

  const stateOfHiddenAssets = showHiddenAssets
    ? t("stateOfHiddenAssets1")
    : t("stateOfHiddenAssets2")

  useEffect(() => {
    if (hiddenAssetsRef.current) {
      setMaxHeight(hiddenAssetsRef.current.scrollHeight)
    }
  }, [hiddenAssetsRef?.current?.scrollHeight])

  return (
    <>
      <div className="hidden_assets_button" ref={buttonRef}>
        <SharedButton
          type="tertiaryGray"
          size="small"
          onClick={() => {
            dispatch(toggleShowHiddenAssets(!showHiddenAssets))
            setTimeout(() => {
              if (!showHiddenAssets) {
                buttonRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            }, 500)
          }}
        >
          {t("hiddenAssets", {
            stateOfHiddenAssets,
            amount: assetAmounts.length,
          })}
        </SharedButton>
      </div>

      <div
        ref={hiddenAssetsRef}
        className={classNames({
          hidden_assets: mountedRef.current,
          visible: mountedRef.current && showHiddenAssets,
        })}
      >
        <SharedBanner
          id="untrusted_assets_banner"
          icon="notif-attention"
          iconColor="var(--attention)"
          customStyles="margin-bottom: 16px;"
          canBeClosed
        >
          <div className="banner">
            <span className="warning_text">
              {t("trustedAssets.banner.title")}
            </span>
            <span className="simple_text">
              {t("trustedAssets.banner.description")}
            </span>
          </div>
        </SharedBanner>
        <WalletAssetList
          assetAmounts={assetAmounts}
          initializationLoadingTimeExpired
        />
      </div>
      <style jsx>{`
        .hidden_assets {
          max-height: 0px;
          overflow: hidden;
          transition: max-height 500ms ease-out;
        }
        .hidden_assets.visible {
          max-height: ${maxHeight}px;
          transition: max-height 500ms ease-in;
        }
        .hidden_assets_button {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px 0 16px;
        }
        .banner {
          display: flex;
          flex-direction: column;
          width: 84%;
        }
        .warning_text {
          font-size: 16px;
          line-height: 24px;
          font-weight: 500;
          color: var(--attention);
        }
      `}</style>
    </>
  )
}

'use client';

import { useEffect, useRef, useState } from 'react';

import { useToggle } from '@react-hookz/web';
import DrinkItem from 'app/stamp/components/DrinkItem';
import Loading from 'components/Loading';
import { ReplaceLoginPageModal } from 'components/ReplaceLoginPageModal';
import { Button } from 'components/button';
import Path from 'lib/Path';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { drinkWhiteImage } from 'public/images';
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk';
import { SvgIcPrev } from 'src/assets/icons/components';
import SvgIcMyLocationFloating from 'src/assets/icons/ic_my_location_floating.svg';
import styled from 'styled-components';

import RegionBottomSheet from './RegionBottomsheet';
import useDrinksMapService from '../services/useDrinksMapService';

interface Location {
  latitude: number;
  longitude: number;
}
// DrinkMapInfo에 isOpen:boolean 이 합쳐져 있는 타입

const MapContainer = () => {
  const router = useRouter();
  const [isReplaceLoginPageModal, onToggleReplaceLoginPageModal] = useToggle();

  const [delayRender, setDelayRender] = useState(true);
  const [nowIn, setNowIn] = useState('');

  const onChangeNowIn = (clickRegion: string) => {
    setNowIn(clickRegion);
  };

  useEffect(() => {
    setTimeout(() => {
      setDelayRender(false);
    }, 600);
  }, []);

  const [_, toggleMap] = useToggle();
  const [loading, setLoading] = useState(false);

  const mapRef = useRef<kakao.maps.Map>(null);
  const [on, toggle] = useToggle();
  const [mapXY, setMapXY] = useState({
    startX: 33.64225953272826,
    startY: 119.06076029979886,
    endX: 40.856225138838,
    endY: 132.02500466772065,
  });

  useEffect(() => {
    setTimeout(() => {
      toggleMap();
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { drinkMarkerList, onClickDrinkMarker } = useDrinksMapService({
    endX: mapXY.endX,
    endY: mapXY.endY,
    page: 0,
    size: 100,
    startX: mapXY.startX,
    startY: mapXY.startY,
  });

  const [state, setState] = useState({
    // 지도의 초기 위치 서울 시청
    center: { lat: 36.75158343784174, lng: 127.90408370095267 },
    // 지도 위치 변경시 panto를 이용할지에 대해서 정의
    isPanto: false,
    level: 13,
  });

  const onIdleMap = () => {
    const map = mapRef.current;
    if (map) {
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      setMapXY({
        startX: sw.getLat(),
        startY: sw.getLng(),
        endX: ne.getLat(),
        endY: ne.getLng(),
      });
    }
  };

  const setChangeMapCenter = (lat: number, lng: number) => {
    console.log(lat, lng);
    setState({
      center: { lat, lng },
      isPanto: true,
      level: 11,
    });
    setTimeout(() => {
      console.log('onIdleMap');
      onIdleMap();
    }, 100);
  };

  const [onLocation, toggleOnLocation] = useToggle(false);

  const toggleLocationLoading = () => {
    if (!onLocation) {
      setLoading(true);
    }
    toggleOnLocation();
  };

  // location 정보 저장
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  // 에러 메세지 저장
  const [, setError] = useState('');

  // Geolocation의 `getCurrentPosition` 메소드에 대한 성공 callback 핸들러
  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    setChangeMapCenter(latitude, longitude);
    setLoading(false);
    setLocation({
      latitude,
      longitude,
    });
  };

  console.log(location);

  // Geolocation의 `getCurrentPosition` 메소드에 대한 실패 callback 핸들러
  const handleError = (error: GeolocationPositionError) => {
    setError(error.message);
  };

  useEffect(() => {
    if (!onLocation) {
      return;
    }
    const { geolocation } = navigator;

    // 사용된 브라우저에서 지리적 위치(Geolocation)가 정의되지 않은 경우 오류로 처리합니다.
    if (!geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    // Geolocation API 호출
    geolocation.getCurrentPosition(handleSuccess, handleError);
  }, [onLocation]);

  if (delayRender) {
    return <Loading />;
  }

  return (
    <Container>
      <TopBox>
        <SettingWrapper>
          <h1 className="title">
            {nowIn === '' ? (
              <>
                여행지 근처의
                <br /> 우리술을 찾아드려요
              </>
            ) : (
              <>
                <span className="highlight">{nowIn}</span> 근처에 있는
                <br /> <span className="highlight">우리술</span>이에요.
              </>
            )}
          </h1>

          <Button variant="primary" height="40px" width="82px" onClick={toggle}>
            직접 설정
          </Button>
        </SettingWrapper>
        <div className="description">
          여행지를 설정하면 근처에 있는 우리술을
          <br />
          추천받을 수 있어요.
        </div>
      </TopBox>

      <div style={{ position: 'relative', height: '375px' }}>
        <Map // 지도를 표시할 Container
          id="map"
          onLoadStart={() => {
            window.dispatchEvent(new Event('resize'));
          }}
          onLoad={() => {
            mapRef.current?.getNode();
          }}
          center={state.center}
          isPanto={state.isPanto}
          style={{
            // 지도의 크기
            width: '100%',
            height: '375px',
          }}
          ref={mapRef}
          level={state.level} // 지도의 확대 레벨
          onIdle={() => onIdleMap()}
        >
          {onLocation && (
            <MapMarker // 마커를 생성합니다
              position={{
                // 마커가 표시될 위치입니다
                lat: location.latitude,
                lng: location.longitude,
              }}
              image={{
                src: 'https://elasticbeanstalk-ap-northeast-2-319210348301.s3.ap-northeast-2.amazonaws.com/static/f0bc29bd-c5a8-46ad-9012-e5401f0a1636pin.svg',
                size: {
                  width: 29,
                  height: 42,
                },
              }}
            />
          )}
          {drinkMarkerList.map(({ latitude, longitude, drinkId }, index) => (
            <MapMarker // 마커를 생성합니다
              clickable={true}
              onClick={() => onClickDrinkMarker(drinkId)}
              key={`${drinkId}-${latitude}-${longitude}-${index}`}
              position={{
                // 마커가 표시될 위치입니다
                lat: latitude,
                lng: longitude,
              }}
            />
          ))}
          {drinkMarkerList.map(
            ({ drinkId, isOpen, latitude, longitude, name }, index) => (
              <CustomOverlayMap
                key={`overlay-${drinkId}-${latitude}-${longitude}-${index}`}
                position={{
                  lat: latitude,
                  lng: longitude,
                }}
              >
                {isOpen && (
                  <DrinkInfoPin>
                    <PinText>{name}</PinText>
                    <DrinkLink
                      onClick={() =>
                        router.push(`${Path.DRINK_INFO_PAGE}/${drinkId}`)
                      }
                    >
                      <SvgIcPrev transform="rotate(180)" />
                    </DrinkLink>
                  </DrinkInfoPin>
                )}
              </CustomOverlayMap>
            ),
          )}

          <MyLocationButton
            onClick={() => {
              toggleLocationLoading();
            }}
          >
            <Image
              src={SvgIcMyLocationFloating}
              width={40}
              height={40}
              alt="내위치 켜기"
            />
          </MyLocationButton>
        </Map>
      </div>
      {/* <FilterBox>
        <RegionSmallSelect
          defaultOption={sortBy}
          onChangeSortOption={onChangeDrinkInfoSortOption}
          options={DRINK_INFO_SORT_LIST}
        />
      </FilterBox> */}
      <DrinkBox>
        {drinkMarkerList.map(
          (
            { drinkId, name, latitude, longitude, image, manufacturer },
            index,
          ) => (
            <DrinkItem
              key={`${drinkId}-${index}`}
              drinkInfo={{
                id: drinkId,
                name: name,
                manufacturer: manufacturer,
                image: image || (drinkWhiteImage as unknown as string),
              }}
              onClickReplaceDrinkInfo={() => {
                setChangeMapCenter(latitude, longitude);
              }}
              selectedDrinkList={[]}
              onToggleReplaceLoginPageModal={onToggleReplaceLoginPageModal}
            />
          ),
        )}
      </DrinkBox>
      {loading && <Loading />}
      <RegionBottomSheet
        setChangeMapCenter={setChangeMapCenter}
        onToggleDrinkSearchModal={toggle}
        on={on}
        onChangeNowIn={onChangeNowIn}
      />
      {isReplaceLoginPageModal && (
        <ReplaceLoginPageModal
          onToggleReplaceLoginPageModal={onToggleReplaceLoginPageModal}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const TopBox = styled.section`
  padding: 20px;
  .title {
    color: ${({ theme }) => theme.colors.black_01};
    text-align: left;
    ${({ theme }) => theme.typography.headline02};
    padding-bottom: 8px;
    .highlight {
      color: ${({ theme }) => theme.colors.main_01};
    }
  }

  .description {
    color: ${({ theme }) => theme.colors.black_02};
    ${({ theme }) => theme.typography.body_long03};
  }
`;

const SettingWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const DrinkBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 30px 20px;
`;

const MyLocationButton = styled.div`
  position: absolute;
  z-index: 100;
  left: 20px;
  bottom: 20px;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.4),
    0px 8px 20px 0px rgba(235, 235, 235, 0.4);
`;

const DrinkInfoPin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 46px;
  position: absolute;
  top: -70px;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  background-color: white;

  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.4);
`;

const PinText = styled.div`
  ${({ theme }) => theme.typography.caption_chip};
  text-align: center;
  flex: 1;
`;

const DrinkLink = styled.div`
  cursor: pointer;
  ${({ theme }) => theme.typography.caption_chip};
  background-color: ${({ theme }) => theme.colors.main_01};
  color: ${({ theme }) => theme.colors.white};
  height: 100%;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 18px;
`;

export default MapContainer;

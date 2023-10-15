import { Button } from "components/button";
import styled, { css } from "styled-components";
import Path from "lib/Path";
import { useRouter, useSearchParams } from "next/navigation";
import DrinkItem from "./DrinkItem";
import { DrinkInfoSortType } from "src/types/common";
import useGetDrinkList from "../services/useGetDrinkList";

interface Props {
  searchText: string;
  sortOption: DrinkInfoSortType;
  regionOption: string;
  isSelectedTab: boolean;
}

function DrinkList({ searchText, sortOption, regionOption }: Props) {
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get("selectedTab");

  const { drinkList, subscribe } = useGetDrinkList({
    page: 0,
    size: selectedTab === "drinkInfo" ? 10 : 3,
    keyword: searchText,
    region: regionOption,
    sortBy: sortOption,
  });

  if (!drinkList) {
    return <></>;
  }

  const router = useRouter();
  const onClickDrinkItem = (id: number) => {
    router.push(`${Path.DRINK_INFO_PAGE}/${id}`);
  };

  return (
    <Container>
      {drinkList.map((drinkInfo) => (
        <DrinkItem
          key={drinkInfo.id}
          drinkInfo={drinkInfo}
          onClickDrinkItem={() => onClickDrinkItem(drinkInfo.id)}
        />
      ))}
      {selectedTab === "drinkInfo" && <div ref={subscribe}></div>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
`;

export default DrinkList;

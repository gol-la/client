import { Vote } from "lib/apis/vote";
import Path from "lib/Path";
import { useRouter } from "next/navigation";
import useBookmarkService from "services/useBookmarkService";
import styled from "styled-components";
import ChipContainer from "./ChipContainer";
import VoteDescription from "./VoteDescription";

interface Props {
  voteDrink: Vote;
}
/**
 *
 * @Todo 타입 더 깔끔하게 정의 필요
 */
function DrinkVoteItem({ voteDrink }: Props) {
  const { voteId, region, title, imageA, imageB } = voteDrink;

  const { mutateBookMark, bookMarkCheckQuery } = useBookmarkService(voteId);

  const { data: bookmarkCheck } = bookMarkCheckQuery;

  const isBookmark = bookmarkCheck?.bookmarked || false;

  const router = useRouter();
  const onClickDrinkVoteItem = () => {
    router.push(`${Path.VOTE_DETAIL_PAGE}/${voteId}`);
  };

  return (
    <Container onClick={onClickDrinkVoteItem}>
      <ChipContainer
        title={title}
        date="20.08.22"
        region={region}
        mutateBookMark={mutateBookMark}
        isBookmark={isBookmark}
      />
      <VoteDescription imageA={imageA} imageB={imageB} />
    </Container>
  );
}

const Container = styled.button`
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.line_02};
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.08), 0px 10px 25px 0px rgba(0, 0, 0, 0.06);
  padding: 20px;
`;

export default DrinkVoteItem;
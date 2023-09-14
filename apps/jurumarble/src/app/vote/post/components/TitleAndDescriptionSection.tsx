import { Button } from "components/button";
import styled, { css, useTheme } from "styled-components";

interface Props {
  title: string;
  onChangeVoteText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isCompleted: boolean;
}

function TitleAndDescriptionSection({ title, onChangeVoteText, isCompleted }: Props) {
  const theme = useTheme();

  return (
    <>
      <H3>제목</H3>
      <TextArea
        placeholder="제목을 입력해주세요"
        borderColor={theme.colors.line_01}
        value={title}
        onChange={onChangeVoteText}
      />
      <H3>설명</H3>
      <TextArea placeholder="설명을 입력해주세요" borderColor={theme.colors.black_05} />
      <CompleteButton width="100%" height="56px" variant="primary" disabled={isCompleted}>
        등록 완료
      </CompleteButton>
    </>
  );
}

const H3 = styled.h3`
  ${({ theme }) =>
    css`
      ${theme.typography.headline04}
      margin-top: 32px;
    `}
`;

const TextArea = styled.textarea<{ borderColor: string }>`
  ${({ theme, borderColor }) =>
    css`
      border: 1px solid ${borderColor};
      margin-top: 12px;
      border-radius: 4px 0px 0px 4px;
      resize: none;
      width: 100%;
      height: 102px;
      padding: 14px;
      ::placeholder {
        ${theme.typography.body03}
        color: ${theme.colors.black_04};
      }
    `}
`;

const CompleteButton = styled(Button)`
  ${({ theme }) => css`
    ${theme.typography.body01}
    margin-top: 52px;
    :disabled {
      background-color: ${theme.colors.black_05};
      color: ${theme.colors.black_03};
    }
  `}
`;

export default TitleAndDescriptionSection;
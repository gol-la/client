import styled, { css } from "styled-components";
import { Button, transitions } from "@chooz/ui";
import ImageUploadButton from "components/common/ImageUploadButton";
import MbtiSelect from "app/my/components/MbtiSelect";
import { useGetUserInfo } from "hooks/useGetUserInfo";
import { uploadProfileImageAPI } from "lib/apis/upload";
import Path from "lib/Path";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckRound } from "public/images";
import useRegisterService from "services/useRegisterService";
import { media } from "styles/media";
import { Gender } from "types/user";
import { IMAGE_CATEGORY_LIST } from "types/vote";
import { updateUserInfo } from "lib/apis/my";

function UserInfoEditContainer() {
  const router = useRouter();

  const { categoryLists, onClickCategory } = useRegisterService();

  // @Todo useQuery 상태 값을 잘 사용할 수 있는 방법이 없을까
  const { userInfo, setUserInfo } = useGetUserInfo();

  if (!userInfo) return <></>;

  const { gender, username, age, mbti, imageUrl } = userInfo;
  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, username: e.target.value });
  };

  const onChangeMbti = (value: string) => {
    setUserInfo({ ...userInfo, mbti: value });
  };

  const onClickUpdateUserInfo = () => {
    try {
      updateUserInfo({
        nickname: username,
        mbti,
        categoryList: categoryLists,
        image: imageUrl,
      });
      router.push(Path.MY_PAGE);
    } catch (error) {
      alert("MBTI 수정 후 2개월 내에 수정할 수 없습니다.");
    }
  };

  const onUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    // if (e.target.files[0].size > 10000000 || e.target.files[1].size > 10000000) {
    //   alert("파일 용량이 10MB를 초과하였습니다.");
    //   return;
    // }

    const formData = new FormData();
    formData.append("images", e.target.files[0]);
    try {
      const data = await uploadProfileImageAPI(formData);
      setUserInfo({ ...userInfo, imageUrl: data.imageUrl });
    } catch (error) {
      alert("이미지 업로드에 실패했습니다." + error);
    }
    return;
  };

  return (
    <PageInner>
      <FlexSpaceBetween>
        <ImageUpload htmlFor="file">
          {imageUrl ? (
            <Image alt="프로필 사진" src={imageUrl} width={107} height={107} />
          ) : (
            <ImageUploadButton width="107px" height="107px" />
          )}
          <ImageUploadInput multiple type="file" id="file" onChange={onUploadImage} />
        </ImageUpload>
        <WithdrawalButton>회원 탈퇴</WithdrawalButton>
      </FlexSpaceBetween>
      <UserInfoTitle>닉네임</UserInfoTitle>
      <NicknameInput type="text" value={username} onChange={onChangeUsername} />
      <UserInfoTitle>성별 및 나이</UserInfoTitle>
      <FlexSpaceBetween>
        <GenderAndAgeInput type="text" value={gender === Gender.MALE ? "남성" : "여성"} disabled />
        <GenderAndAgeInput type="text" value={`${age}세`} disabled />
      </FlexSpaceBetween>
      <UserInfoTitle>MBTI</UserInfoTitle>
      <MbtiSelect mbtiOption={mbti} onChangeMbti={onChangeMbti}></MbtiSelect>
      <WarningMessage>MBTI 수정시 2개월간 바꿀 수 없습니다.</WarningMessage>
      <UserInfoTitle>카테고리</UserInfoTitle>
      <CategoryContainer>
        {/* @Todo 컴포넌트화 하기 */}
        {IMAGE_CATEGORY_LIST.map(({ image, value, label }) => (
          <Category
            width="49%"
            height="104px"
            borderRadius="10px"
            key={`profile_edit_page_${value}`}
            selected={categoryLists.includes(value)}
            onClick={onClickCategory}
            name={value}
          >
            <Image alt="항목" src={image} height={32} />
            <CategoryText>
              {categoryLists.includes(value) && (
                <CheckBoxWrapper>
                  <Image alt="선택" src={CheckRound} width={16} />
                </CheckBoxWrapper>
              )}
              {label}
            </CategoryText>
          </Category>
        ))}
      </CategoryContainer>
      <CompleteButton variant="primary" width="100%" height="56px" onClick={onClickUpdateUserInfo}>
        완료
      </CompleteButton>
    </PageInner>
  );
}

const PageInner = styled.div`
  position: relative;
  top: -1px;
  margin: 0 auto;
  border-radius: 0 0 4px 4px;
  max-width: 640px;
  overflow-y: scroll;
  /* @Todo 값을 어떻게 설정하는건지 모르겠다. 일단 임의로 설정 */
  height: calc(100vh - 100px);
  padding: 24px 20px 20px 20px;
  ${({ theme }) =>
    css`
      background-color: ${theme.palette.background.white};
    `};
  ${media.medium} {
    padding: 34px 40px;
  }
`;

const FlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WithdrawalButton = styled.button`
  display: contents;
  ${({ theme }) =>
    css`
      color: ${theme.palette.ink.light};
      ${media.medium} {
        ${theme.textStyle.Title_Small}
      }
    `};
`;

const UserInfoTitle = styled.h3`
  font-weight: 700;
  margin: 30px 0 8px;
`;

const NicknameInput = styled.input`
  width: 100%;
  height: 40px;
  margin-bottom: 30px;
  padding: 10px 186px 10px 10px;
  border-radius: 4px;
  border: solid 1px ${({ theme }) => theme.palette.border.base};
`;

const GenderAndAgeInput = styled.input`
  width: 50%;
  height: 40px;
  margin: 0 9px 30px 0;
  padding: 10px 111px 10px 10px;
  border-radius: 4px;
  color: ${({ theme }) => theme.palette.ink.light};
`;

const WarningMessage = styled.div`
  color: ${({ theme }) => theme.palette.system.danger};
  margin-top: 6px;
`;

const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 9px;
  ${media.medium} {
    gap: 14px 16px;
  }
`;

const Category = styled(Button)<{ selected: boolean }>`
  position: relative;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  font-weight: 400;
  background-color: ${({ theme }) => theme.palette.background.soft};
  border: 1px solid ${({ theme }) => theme.palette.border.base};
  ${({ theme }) => theme.textStyle.Title_Small};
  ${({ theme, selected }) =>
    selected &&
    css`
      animation: ${transitions.blink} 0.7s ease-in-out;
      background-color: ${theme.palette.background.selected};
      border: 1px solid ${theme.palette.main.point};
      font-weight: 700;
    `}
`;

const CategoryText = styled.div`
  align-items: center;
  display: flex;
  gap: 4px;
`;

const CheckBoxWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const CompleteButton = styled(Button)`
  margin-top: 40px;
`;

const ImageUpload = styled.label`
  cursor: pointer;
`;

const ImageUploadInput = styled.input`
  display: none;
`;

export default UserInfoEditContainer;

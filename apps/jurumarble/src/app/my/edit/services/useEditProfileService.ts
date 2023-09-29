import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImageAPI } from "lib/apis/common";
import { updateUserInfoAPI } from "lib/apis/my";
import { queryKeys } from "lib/queryKeys";

type UpdateUserInfoRequest = Exclude<Parameters<typeof updateUserInfoAPI>[0], undefined>;

const getQueryKey = [queryKeys.USER_INFO];

export default function useEditProfileService() {
  const queryClient = useQueryClient();

  const onUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    if (e.target.files[0].size > 10485760) {
      alert("파일 용량이 10MB를 초과하였습니다.");
      return;
    }
    const formData = new FormData();
    formData.append("images", e.target.files[0]);
    try {
      const data = await uploadImageAPI(formData);
      queryClient.setQueryData(getQueryKey, (prev: any) => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (error) {
      alert("이미지 업로드에 실패했습니다." + error);
    }
    return;
  };

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryClient.setQueryData(getQueryKey, (prev: any) => ({ ...prev, nickname: e.target.value }));
  };

  const onChangeAlcoholCapacity = (value: string) => {
    queryClient.setQueryData(getQueryKey, (prev: any) => ({ ...prev, alcoholLimit: value }));
  };

  const onChangeMBTI = (value: string) => {
    queryClient.setQueryData(getQueryKey, (prev: any) => ({ ...prev, mbti: value }));
  };

  const { mutate: updateUserInfo } = useMutation(
    (newUserInfo: UpdateUserInfoRequest) => updateUserInfoAPI(newUserInfo),
    {
      onError: () => {
        /**
         * @TODO 서버 메시지와 연동
         */
        alert("MBTI 수정시 2개월간 바꿀 수 없습니다.");
      },
    },
  );

  return {
    onUploadImage,
    onChangeNickname,
    onChangeAlcoholCapacity,
    onChangeMBTI,
    updateUserInfo,
  };
}
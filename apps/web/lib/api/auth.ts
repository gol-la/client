import axios from "axios";
import { SERVER_URL } from "lib/constants";

export type CodeType = string | string[];

interface KakaoLoginRequest {
  code: CodeType;
  redirectUrl: string;
}

export const kakaoLoginAPI = async (kakaoLoginRequest: KakaoLoginRequest) => {
  const response = await axios.post(`${SERVER_URL}api/oauth/kakao`, kakaoLoginRequest);
  return response.data;
};

interface NaverLoginRequest {
  code: CodeType;
  state: string;
}

export const naverLoginAPI = async (naverLoginRequest: NaverLoginRequest) => {
  const response = await axios.post(`${SERVER_URL}api/oauth/naver`, naverLoginRequest);
  return response.data;
};

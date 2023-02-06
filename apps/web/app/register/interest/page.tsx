"use client";

import InterestSection from "components/register/InterestSection";
import React from "react";
import useRegisterService from "services/useRegisterService";
import styled from "styled-components";
import { media } from "styles/media";

function Interest() {
  const { categoryLists, onClickCategory, onClickComplete } = useRegisterService();
  return (
    <PageWrapper>
      <PageInner>
        <InterestSection
          categoryLists={categoryLists}
          onClickCategory={onClickCategory}
          onClickComplete={onClickComplete}
        />
      </PageInner>
    </PageWrapper>
  );
}

export default Interest;

const PageWrapper = styled.div`
  width: 100%;
`;

const PageInner = styled.div`
  margin: 0 auto;
  border-radius: 4px;
  height: 620px;
  background-color: white;
  max-width: 640px;
  position: relative;
  padding: 30px;
  ${media.medium} {
    height: 734px;
    padding: 80px;
  }
`;

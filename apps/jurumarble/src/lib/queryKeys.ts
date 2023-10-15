export const queryKeys = {
  HOT_DRINK_LIST: "hotDrinkList" as const,
  HOT_DRINK_VOTE: "hotDrinkVote" as const,
  MAIN_VOTE_LIST: "mainVoteList" as const,
  BOOKMARK_CHECK: "bookmarkCheck" as const,
  USER_INFO: "userInfo" as const,
  VOTE_LIST: "voteList" as const,
  RESTAURANT_LIST: "restaurantList" as const,
  RESTAURANT_IMAGE_LIST: "restaurantImageList" as const,
  SEARCH_DRINK_LIST: "searchDrinkList" as const,
  SEARCH_VOTE_DRINK_LIST: "searchVoteDrinkList" as const,
  VOTE_DETAIL: "voteDetail" as const,
  VOTING_CHECK: "votingCheck" as const,
  DETAIL_COMMENT_LIST: "commentByVoteId" as const,
  DETAIL_VOTE_COUNT: "voteCountByVoteId" as const,
  DRINK_STAMP_LIST: "drinkStampList" as const,
  DRINK_STAMP: "drinkStamp" as const,
  DETAIL_FILTERED_ANALYSIS: "filteredAnalysisByVoteId" as const,
  MY_PARTICIPATED_VOTE: "myParticipatedVote" as const,
  MY_CREATED_VOTE: "myCreatedVote" as const,
  MY_BOOKMARKED_VOTE: "myBookmarkedVote" as const,
  THE_NUMBER_OF_MY_VOTE: "theNumberOfMyVote" as const,
  DRINKS_MAP: "drinksMap" as const,
  DRINKS_INFO: "drinksInfo" as const,
  NOTIFICATION_LIST: "notificationList" as const,
  LOGIN_INFO: "loginInfo" as const,
  TODAY_DRINK_RECOMMENDATION: "todayDrinkRecommendation" as const,
};

export const reactQueryKeys = {
  // @note any 처리
  mainVoteList: () => [queryKeys.MAIN_VOTE_LIST] as const,
  voteList: (params: any) => [queryKeys.VOTE_LIST, ...params],
  voteDetail: (voteId: number) => [queryKeys.VOTE_DETAIL, voteId] as const,
  votingCheck: (id: number) => [queryKeys.VOTING_CHECK, id] as const,
  detailCommentList: (
    typeId: number,
    commentType: "votes" | "drinks",
    size?: number,
    page?: number,
    sortBy?: string,
  ) => [queryKeys.DETAIL_COMMENT_LIST, typeId, commentType, size, page, sortBy] as const,
  detailVoteCount: (id: number) => [queryKeys.DETAIL_VOTE_COUNT, id] as const,
  detailFilterdAnalysis: (
    id: number,
    mbti?: string,
    gender?: string,
    age?: string,
    alcoholLimit?: string,
  ) => [queryKeys.DETAIL_FILTERED_ANALYSIS, id, mbti, gender, age, alcoholLimit] as const,
  drinksMap: (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    page: number,
    size: number,
  ) => [queryKeys.DRINKS_MAP, startX, startY, endX, endY, page, size] as const,
  drinksInfo: (id: number) => [queryKeys.DRINKS_INFO, id] as const,
};

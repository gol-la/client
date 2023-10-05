"use client";

import { useMutation } from "@tanstack/react-query";
import { addUserInfoAPI } from "lib/apis/user";
import { DrinkCapacityTypes, GenderTypes } from "lib/constants";
import Path from "lib/Path";
import { useRouter } from "next/navigation";
import { createContext, PropsWithChildren, useMemo, useState } from "react";
import { Direction, MBTIType } from "src/types/register";
import { useToggle } from "@monorepo/hooks";
import {
  NumberPadTypes,
  RegisterStepTypes,
  REGISTER_STEPS_CONTENT,
  YearOfBirthType,
} from "../constants";
import { toast } from "react-toastify";

export const RegisterContext = createContext<{
  step: RegisterStepTypes;
  onNextStep: () => void;
  stepList: RegisterStepTypes[];
  currentStepIndex: number;
  drinkCapacity: DrinkCapacityTypes | null;
  gender: GenderTypes | null;
  yearOfBirth: YearOfBirthType | null;
  MBTI: MBTIType;
  stringfiedMBTI: string;
  buttonDisabled: boolean;
  onChangeDrinkCapacity: (value: DrinkCapacityTypes) => void;
  onChangeGender: (value: GenderTypes) => void;
  onChangeYearOfBirth: (value: string) => void;
  onDeleteYearOfBirth: () => void;
  onChangeMBTI: ({ name, value }: { name: string; value: string }) => void;
  activeValue: (
    direction: Direction,
    MBTIKey: "M" | "B" | "T" | "I",
  ) => "active" | "inactive" | null;
  addUser: () => void;
  isWarningModal: boolean;
  onToggleWarningModal: () => void;
}>({
  step: "STEP1",
  onNextStep: () => {},
  stepList: [],
  currentStepIndex: 0,
  gender: null,
  drinkCapacity: null,
  yearOfBirth: "",
  MBTI: {
    M: null,
    B: null,
    T: null,
    I: null,
  },
  stringfiedMBTI: "",
  buttonDisabled: false,
  onChangeDrinkCapacity: () => {},
  onChangeGender: () => {},
  onChangeYearOfBirth: () => {},
  onDeleteYearOfBirth: () => {},
  onChangeMBTI: () => {},
  activeValue: () => null,
  addUser: () => {},
  isWarningModal: false,
  onToggleWarningModal: () => {},
});

export const RegisterProvider = ({ children }: PropsWithChildren) => {
  const [step, setStep] = useState<RegisterStepTypes>("STEP1");

  const [drinkCapacity, setDrinkCapacity] = useState<DrinkCapacityTypes | null>(null);
  const [gender, setGender] = useState<GenderTypes | null>(null);
  const [yearOfBirth, setYearOfBirth] = useState<YearOfBirthType | null>("");
  const [MBTI, setMBTI] = useState<MBTIType>({
    M: null,
    B: null,
    T: null,
    I: null,
  });

  const stepList = Object.keys(REGISTER_STEPS_CONTENT) as RegisterStepTypes[];
  const currentStepIndex =
    stepList.findIndex((item) => item === step) > -1
      ? stepList.findIndex((item) => item === step) + 1
      : 1;

  const onNextStep = () => {
    if (Number(yearOfBirth) > 2004) {
      toast.error("2004년 이후 출생자는 가입이 불가능합니다.");
      setYearOfBirth("");
      return;
    } else if (999 < Number(yearOfBirth) && Number(yearOfBirth) < 1900) {
      toast.error("출생년도를 다시 한번 확인해주세요.");
      setYearOfBirth("");
      return;
    }

    currentStepIndex < stepList.length
      ? setStep(stepList[currentStepIndex])
      : onToggleWarningModal();
  };

  const onChangeDrinkCapacity = (id: DrinkCapacityTypes) => {
    if (drinkCapacity === id) {
      setDrinkCapacity(null);
      return;
    }
    setDrinkCapacity(id);
  };

  const onChangeGender = (value: GenderTypes) => {
    if (gender === value) {
      setGender(null);
      return;
    }

    setGender(value);
  };

  const onChangeYearOfBirth = (value: NumberPadTypes) => {
    setYearOfBirth((prev) => (prev?.length === 4 ? prev : prev + value));
  };
  const onDeleteYearOfBirth = () => {
    setYearOfBirth("");
  };

  const onChangeMBTI = ({ name, value }: { name: string; value: string }) => {
    setMBTI((prev) => ({ ...prev, [name]: value }));
  };

  const getMBTI = (direction: Direction, MBTIKey: "M" | "B" | "T" | "I") => {
    const lookupTable: Record<Direction, Record<"M" | "B" | "T" | "I", string>> = {
      left: { M: "E", B: "S", T: "T", I: "J" },
      right: { M: "I", B: "N", T: "F", I: "P" },
    };
    return lookupTable[direction][MBTIKey];
  };

  const activeValue = (
    direction: Direction,
    MBTIKey: "M" | "B" | "T" | "I",
  ): "active" | "inactive" | null => {
    if (!MBTI[MBTIKey]) return null;
    return `${MBTI[MBTIKey] === getMBTI(direction, MBTIKey) ? "" : "in"}active`;
  };

  const buttonDisabled = useMemo(() => {
    if (step === "STEP1") {
      return drinkCapacity === null;
    } else if (step === "STEP2") {
      return gender === null;
    } else if (step === "STEP3") {
      return yearOfBirth === "" || yearOfBirth?.length !== 4;
    } else if (step === "STEP4") {
      return Object.values(MBTI).some((value) => value === null);
    }

    return false;
  }, [step, drinkCapacity, gender, yearOfBirth, MBTI]);

  const router = useRouter();

  const stringfiedMBTI = `${MBTI.M}${MBTI.B}${MBTI.T}${MBTI.I}`;

  const { mutate: addUser } = useMutation(
    () =>
      addUserInfoAPI({
        alcoholLimit: drinkCapacity!,
        gender: gender!,
        birthOfAge: Number(yearOfBirth),
        mbti: stringfiedMBTI,
      }),
    {
      onSuccess: () => {
        toast.success("회원가입이 완료되었습니다.");
        router.replace(Path.MAIN_PAGE);
      },
      onError: (error) => alert(error),
    },
  );

  const [isWarningModal, onToggleWarningModal] = useToggle();

  const value = useMemo(
    () => ({
      step,
      onNextStep,
      stepList,
      gender,
      currentStepIndex,
      drinkCapacity,
      yearOfBirth,
      MBTI,
      stringfiedMBTI,
      buttonDisabled,
      onChangeDrinkCapacity,
      onChangeGender,
      onChangeYearOfBirth,
      onDeleteYearOfBirth,
      onChangeMBTI,
      activeValue,
      addUser,
      isWarningModal,
      onToggleWarningModal,
    }),
    [
      step,
      onNextStep,
      stepList,
      gender,
      currentStepIndex,
      drinkCapacity,
      yearOfBirth,
      MBTI,
      stringfiedMBTI,
      buttonDisabled,
      onChangeGender,
      onChangeDrinkCapacity,
      onChangeYearOfBirth,
      onDeleteYearOfBirth,
      onChangeMBTI,
      activeValue,
      addUser,
      isWarningModal,
      onToggleWarningModal,
    ],
  );

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BottomTab from "./BottomTab";
import type { ReactNode } from "react";

const meta: Meta<typeof BottomTab> = {
  title: "Navigation/BottomTab",
  component: BottomTab,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/home",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story: () => ReactNode) => (
      <div
        style={{
          position: "relative",
          height: "100vh",
          backgroundColor: "#131416",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BottomTab>;

// 홈 탭 활성화 상태
export const ActiveHome: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/home",
      },
    },
  },
};

// 학습 탭 활성화 상태
export const ActiveStudy: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/study",
      },
    },
  },
};

// 보관함 탭 활성화 상태
export const ActiveArchive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/archive",
      },
    },
  },
};

// 마이페이지 탭 활성화 상태
export const ActiveMypage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/mypage",
      },
    },
  },
};


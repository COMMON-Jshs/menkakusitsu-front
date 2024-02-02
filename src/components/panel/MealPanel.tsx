import { v1 } from "@common-jshs/menkakusitsu-lib";
import { ReactNode, useState, useEffect } from "react";
import { getMeal } from "../../utils/Api";
import dayjs from "dayjs";
import { Box, Divider, Paper, Skeleton, Typography } from "@mui/material";

interface MealInfoProps {
  type: "breakfast" | "lunch" | "dinner";
  meals?: string[];
}

const MealInfo = (props: MealInfoProps) => {
  const { type, meals } = props;

  const currentHour = dayjs().hour();
  let mealName: string = "";
  let isHighlighted: boolean = false;
  switch (type) {
    case "breakfast":
      mealName = "아침";
      isHighlighted = currentHour >= 19;
      break;
    case "lunch":
      mealName = "점심";
      isHighlighted = currentHour < 13;
      break;
    case "dinner":
      mealName = "저녁";
      isHighlighted = currentHour >= 13 && currentHour < 19;
      break;
  }
  const Meal = ({ children }: { children: ReactNode }) => {
    if (isHighlighted) {
      return (
        <Box
          sx={{
            display: "block",
            padding: "34px 30px 30px 30px",
            borderRadius: "1px",
            borderStyle: "solid none none none",
            borderColor: "primary.main",
            borderWidth: "8px",
            flex: 1,
          }}
        >
          {children}
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            display: "block",
            padding: "50px 30px 30px 30px",
            flex: 1,
          }}
        >
          {children}
        </Box>
      );
    }
  };
  return (
    <Meal>
      <Typography variant="h5">{mealName}</Typography>
      {meals ? (
        meals.map((meal) => {
          return (
            <Typography key={meal} variant="h6">
              <div dangerouslySetInnerHTML={{ __html: `- ${meal}` }} />
            </Typography>
          );
        })
      ) : (
        <Box>
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
        </Box>
      )}
    </Meal>
  );
};

function MealPanel() {
  const [mealInfo, setMealInfo] = useState<v1.GetMealResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = dayjs();
    getMeal({ when: today.startOf("day").format("YYYY-MM-DD") }).then(
      (result) => {
        setMealInfo(result);
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <>
      <Box>
        <Paper>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <MealInfo type="lunch" meals={mealInfo?.lunch.meals} />
            <Divider orientation="vertical" flexItem />
            <MealInfo type="dinner" meals={mealInfo?.dinner.meals} />
            <Divider orientation="vertical" flexItem />
            <MealInfo type="breakfast" meals={mealInfo?.breakfast.meals} />
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default MealPanel;

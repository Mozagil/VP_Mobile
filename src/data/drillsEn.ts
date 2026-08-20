// English content for every drill in drills.ts, keyed by drill id.
//
// Kept in a separate file so drills.ts stays the single Turkish source of truth:
// ids, phase, skill, level, players and duration live there and are never
// duplicated here. Only the reader-facing text is translated.
//
// The description keeps the same four-section shape as the Turkish original so
// parseDrillDesc() can split it; the English headers are registered in
// utils/drillText.ts.

export type DrillEn = {
  name: string;
  desc: string;
  tags: string[];
};

const NO_EQUIPMENT = 'Equipment Needed: No equipment required (solo drill).';
const BALL = 'Equipment Needed: Volleyball.';
const BALL_NET = 'Equipment Needed: Volleyball, net.';

export const DRILL_EN: Record<number, DrillEn> = {
  // ── Warm-up ────────────────────────────────────────────────────────────────
  141: {
    name: 'Walking Patrick Step – Hip Opener',
    desc: [
      'Drill Objective: Dynamically increase external rotation and flexion range of the hip joint; prepare the hips and legs before training with a walking hip-opening pattern.',
      NO_EQUIPMENT,
      "Execution: The player starts standing. One knee is lifted up and out so the hip rotates externally (forming a shape like a figure '4'), then the leg is planted forward as a step. The movement is repeated alternating right and left while walking forward. On every step the hip opens outward briefly and is carried forward under control.",
      'Key Points: Keep the torso upright, maintain balance and move in a smooth rhythm. The goal is to activate the hip joint through its full range before training.',
    ].join('\n\n'),
    tags: ['Patrick Step', 'Hip Opener', 'Dynamic Mobility', 'Walking Hip Rotation', 'Warm-up', 'Solo', 'No Equipment'],
  },
  142: {
    name: 'Single Knee-to-Chest Stretch',
    desc: [
      'Drill Objective: Release tension in the lower back and hips and support hip flexion range; offer a gentle mobility/stretch option for both the preparation and the recovery phase.',
      NO_EQUIPMENT,
      'Execution: The player lies on their back with the legs straight or the knees slightly bent. One knee is grasped with both hands and drawn toward the chest while the other leg rests comfortably on the floor. Keep the lower back close to the floor and the shoulders and neck relaxed. The stretch is felt behind the hip and in the lower back.',
      'Key Points: As a warm-up, hold briefly and under control for 2-3 breaths; as a cool-down, hold longer and deeper as a static stretch. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Knee to Chest', 'Lower Back', 'Hip Mobility', 'Stretching', 'Warm-up', 'Cool-down', 'Solo', 'No Equipment'],
  },
  146: {
    name: 'Downward Dog',
    desc: [
      'Drill Objective: Stretch the shoulders, back, hamstrings and calves at the same time; lengthen the spine to provide general trunk-and-leg mobility in both the preparation and recovery phase.',
      NO_EQUIPMENT,
      'Execution: With the hands and feet on the floor the player forms an inverted V. Hands are shoulder-width apart, feet hip-width apart. The hips are pushed up and back while the arms and back lengthen into a straight line. Try to bring the heels toward the floor; the knees may stay slightly bent if needed.',
      'Key Points: The head hangs comfortably between the arms and the shoulders stay away from the ears. The stretch is felt in the shoulders, upper back, hamstrings and calves. Hold briefly as a warm-up, longer and deeper as a cool-down.',
    ].join('\n\n'),
    tags: ['Downward Dog', 'Shoulder Stretch', 'Hamstring', 'Calf', 'Full Body', 'Warm-up', 'Cool-down', 'Solo'],
  },
  151: {
    name: 'Cross-Body Shoulder Stretch',
    desc: [
      'Drill Objective: Increase flexibility in the rear shoulder (posterior deltoid) and upper back; support shoulder comfort before and after spiking and blocking.',
      NO_EQUIPMENT,
      'Execution: Standing or seated, the player extends one arm across the chest toward the opposite side. The other arm holds it at the elbow or upper arm and gently presses it toward the chest. Keep the shoulders down and relaxed and the torso still. The stretch is felt behind the shoulder of the extended arm.',
      'Key Points: Apply pressure gradually and under control — never yank or pull sharply. Use short, dynamic holds as a warm-up and longer static holds as a cool-down. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Shoulder Stretch', 'Cross-Body Arm', 'Posterior Deltoid', 'Upper Back', 'Stretching', 'Warm-up', 'Cool-down', 'Solo'],
  },
  153: {
    name: 'Overhead Triceps Stretch',
    desc: [
      'Drill Objective: Release tension in the back of the arm (triceps) and the top of the shoulder; support arm range of motion before and after spiking and serving.',
      NO_EQUIPMENT,
      'Execution: The player raises one arm, bends the elbow and lowers the hand toward the upper back behind the neck. The other hand gently holds the bent elbow and presses it slightly back and down; the stretch is felt in the triceps and the top of the shoulder.',
      'Key Points: Keep the torso upright, avoid arching the lower back and apply pressure under control. Use short dynamic holds before training and longer static holds in the cool-down. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Triceps Stretch', 'Back of Arm', 'Shoulder Stretch', 'Overhead Stretch', 'Warm-up', 'Cool-down', 'Solo', 'No Equipment'],
  },
  155: {
    name: 'Half-Kneeling Hip Flexor Stretch',
    desc: [
      'Drill Objective: Increase hip flexor flexibility; support hip range of motion in movements such as the attack approach and the jump.',
      NO_EQUIPMENT,
      'Execution: The player takes a half-kneeling position with one knee on the floor and the other foot in front, knee bent to 90 degrees. The hips are pushed gently forward with the torso upright. The stretch is felt at the front of the hip on the kneeling side. Optionally, reaching the back arm overhead deepens the stretch.',
      'Key Points: Do not over-arch the lower back, and keep the torso balanced as the hips move forward. Use short controlled holds as a warm-up and longer, deeper static holds as a cool-down. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Hip Flexor Stretch', 'Half-Kneeling', 'Hip Mobility', 'Warm-up', 'Cool-down', 'Solo', 'No Equipment'],
  },
  157: {
    name: 'Seated Butterfly Knee Raise',
    desc: [
      'Drill Objective: Dynamically activate the inner and outer hip muscles (adductors/abductors); prepare the hip joint for training by raising and lowering the knees in the butterfly position.',
      NO_EQUIPMENT,
      'Execution: The player sits on the floor, presses the soles of the feet together, lets the knees fall out to the sides and holds the feet with both hands — the butterfly starting position. From there the knees are lowered toward the floor under control, then lifted back up using the hip muscles. Repeat alternating right and left, or both knees together, in a smooth rhythm.',
      'Key Points: Keep the back upright and the movement controlled rather than jerky. The soles stay pressed together and the power comes from the hip joint. The goal is not to stretch the muscle but to prepare the inner and outer hip dynamically for training.',
    ].join('\n\n'),
    tags: ['Butterfly Position', 'Knee Raise', 'Hip Activation', 'Adductors', 'Dynamic Warm-up', 'Warm-up', 'Solo', 'No Equipment'],
  },
  158: {
    name: 'Ankle Circles',
    desc: [
      'Drill Objective: Increase ankle range of motion; prepare the ankle and lower leg for jumping and change-of-direction movements.',
      NO_EQUIPMENT,
      'Execution: The player stands on one foot or sits and lifts one foot off the floor. Starting from the ankle, the foot traces wide, controlled circles clockwise. After the set time in one direction, repeat for the same time in the opposite direction. The movement comes only from the ankle; the leg stays still.',
      'Key Points: Hold on to something lightly for balance if needed. The aim is to prepare the ankle against possible sprains and to warm the joint through movement. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Ankle Circles', 'Joint Mobility', 'Dynamic Warm-up', 'Lower Leg', 'Warm-up', 'Solo', 'No Equipment'],
  },
  159: {
    name: 'Standing Arm Swings',
    desc: [
      'Drill Objective: Increase blood flow to the shoulders and chest; warm the upper body dynamically to prepare arm and shoulder range of motion before serving and spiking.',
      NO_EQUIPMENT,
      'Execution: The player stands with the feet shoulder-width apart. The arms swing across each other in front of the body, then open backward to stretch the chest. Repeat at a controlled tempo with gradually increasing range. Keep the shoulders relaxed and initiate the movement from the arms.',
      'Key Points: The aim is not to stretch the muscles but to dynamically increase blood flow and range of motion in the shoulder joint. The movement should be smooth and rhythmic, never jerky.',
    ].join('\n\n'),
    tags: ['Arm Swings', 'Shoulder Activation', 'Dynamic Warm-up', 'Chest Stretch', 'Warm-up', 'Solo', 'No Equipment'],
  },
  161: {
    name: 'Knee Bends',
    desc: [
      'Drill Objective: Warm the knee and hip joints dynamically; increase blood flow to the leg muscles to prepare for jumping and attacking movements.',
      NO_EQUIPMENT,
      'Execution: The player stands upright with the feet shoulder-width apart and rests the hands lightly on the knees. As the torso leans slightly forward, the knees bend under control and the body lowers; then the knees and torso straighten together back to the start position.',
      'Key Points: Keep the weight evenly distributed across the feet, let the hands support the knees lightly and avoid rounding the back excessively. The tempo should be controlled and rhythmic, never jerky. The aim is to prepare the leg and hip muscles for the training load to come.',
    ].join('\n\n'),
    tags: ['Knee Bends', 'Dynamic Warm-up', 'Leg Activation', 'Lower Body', 'Warm-up', 'Solo', 'No Equipment'],
  },
  162: {
    name: 'Leg Swings',
    desc: [
      'Drill Objective: Dynamically increase hip range of motion; speed up blood flow to the hamstrings and hip flexors to prepare for jumping and attacking movements.',
      NO_EQUIPMENT,
      'Execution: The player balances on one leg, holding on to something lightly if needed. The other leg swings forward and backward under control. The range increases gradually as the body warms up. Keep the torso upright, initiate the swing from the hip joint and avoid excessive movement in the lower back.',
      'Key Points: The aim is to prepare the hip and hamstring dynamically without forcing the leg. The movement should be smooth and controlled; avoid hard or jerky swings. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Leg Swings', 'Hip Mobility', 'Dynamic Warm-up', 'Hamstring Activation', 'Warm-up', 'Solo', 'No Equipment'],
  },
  163: {
    name: 'Hip Circles',
    desc: [
      'Drill Objective: Increase hip range of motion in every direction; prepare the muscles and connective tissue around the hip for training.',
      NO_EQUIPMENT,
      'Execution: The player stands with the feet hip-width apart and the hands on the hips. Keeping the torso still, the hips rotate in a wide circle in one direction. After the set time in one direction (right to left), repeat for the same time in the opposite direction (left to right).',
      'Key Points: The knees and feet stay still during the movement and the rotation comes only from the hip joint. The aim is to dynamically increase hip range of motion in every direction.',
    ].join('\n\n'),
    tags: ['Hip Circles', 'Hip Mobility', 'Dynamic Warm-up', 'Joint Preparation', 'Warm-up', 'Solo', 'No Equipment'],
  },

  // ── Cool-down ──────────────────────────────────────────────────────────────
  138: {
    name: 'Seated Butterfly Stretch',
    desc: [
      'Drill Objective: Increase flexibility of the inner hip (adductors) and groin; support recovery by releasing tension in the hip joint after training.',
      NO_EQUIPMENT,
      'Execution: The player sits on the floor, lets the knees fall out to the sides, presses the soles of the feet together and draws the heels toward the body. The back is upright and the shoulders relaxed. The knees are pressed gently toward the floor; stop where tension is felt and hold the position without forcing it. Optionally, leaning the torso slightly forward deepens the stretch.',
      'Key Points: Breathe deeply and evenly throughout and keep the shoulders relaxed and away from the ears. Do not bounce or press suddenly — the stretch should be steady and controlled.',
    ].join('\n\n'),
    tags: ['Butterfly Stretch', 'Inner Hip', 'Adductors', 'Flexibility', 'Static Stretch', 'Cool-down', 'Solo', 'No Equipment'],
  },
  139: {
    name: "Child's Pose",
    desc: [
      'Drill Objective: Release tension in the lower back, hips and shoulders; calm the nervous system after training for general relaxation and recovery.',
      NO_EQUIPMENT,
      'Execution: Starting on the knees, the player lowers the hips toward the heels and reaches the arms forward, bringing the upper body toward the floor. The forehead rests on the floor or on a support. Try to keep the hips near the heels and the chest near the knees; the shoulders relax and the arms extend comfortably forward, palms down.',
      'Key Points: Breathe slowly and deeply throughout, letting the body sink a little closer to the floor with each exhale. Do not hold tension in the neck and shoulders — the position should stay completely passive and comfortable.',
    ].join('\n\n'),
    tags: ["Child's Pose", 'Lower Back', 'Hips', 'Relaxation', 'Static Stretch', 'Cool-down', 'Solo', 'No Equipment'],
  },
  140: {
    name: 'Seated Single-Leg Hamstring Stretch',
    desc: [
      'Drill Objective: Increase flexibility of the hamstrings; release tension at the back of the leg after jumping and rapid changes of direction.',
      NO_EQUIPMENT,
      'Execution: The player sits on the floor, extends one leg straight forward and places the sole of the other foot against the inner thigh of the extended leg, letting that knee fall out to the side. Keeping the back flat, the player hinges forward from the hips and slides the hands toward the calf, ankle or foot of the extended leg. Stop where tension is felt.',
      'Key Points: Do not round the spine — the hinge starts at the hip joint. The knee may stay slightly bent; the aim is to stretch the hamstring without straining the back. Switch sides when the set time is up.',
    ].join('\n\n'),
    tags: ['Hamstring Stretch', 'Seated Stretch', 'Back of Thigh', 'Flexibility', 'Static Stretch', 'Cool-down', 'Solo', 'No Equipment'],
  },
  143: {
    name: 'Single Knee-to-Chest Stretch',
    desc: [
      'Drill Objective: Release tension in the lower back and hips and support hip flexion range; offer a gentle mobility/stretch option for both the preparation and the recovery phase.',
      NO_EQUIPMENT,
      'Execution: The player lies on their back with the legs straight or the knees slightly bent. One knee is grasped with both hands and drawn toward the chest while the other leg rests comfortably on the floor. Keep the lower back close to the floor and the shoulders and neck relaxed. The stretch is felt behind the hip and in the lower back.',
      'Key Points: As a warm-up, hold briefly and under control for 2-3 breaths; as a cool-down, hold longer and deeper as a static stretch. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Knee to Chest', 'Lower Back', 'Hip Mobility', 'Stretching', 'Warm-up', 'Cool-down', 'Solo', 'No Equipment'],
  },
  144: {
    name: 'Standing Forward Fold',
    desc: [
      'Drill Objective: Increase flexibility of the hamstrings and lower back; release tension along the back of the legs and around the spine with a standing forward fold.',
      NO_EQUIPMENT,
      'Execution: The player stands with the feet hip-width apart. Keeping the knees slightly bent, the player hinges forward from the hips and reaches the hands toward the toes or the floor. The head and neck stay relaxed and the weight of the torso hangs down naturally with gravity. The aim is not to force the fingers to the toes but to feel a controlled stretch behind the legs.',
      'Key Points: Do not bounce or move suddenly in the position; hold the stretch steady and deepen it with the breath. When coming back up, keep the knees slightly bent and roll the spine up gradually from the bottom.',
    ].join('\n\n'),
    tags: ['Forward Fold', 'Hamstring Stretch', 'Lower Back', 'Standing Stretch', 'Static Stretch', 'Cool-down', 'Solo', 'No Equipment'],
  },
  145: {
    name: 'Seated Single-Leg Forward Fold',
    desc: [
      'Drill Objective: Increase hamstring, calf and lower-back flexibility; release tension along the whole back line of the leg with a deeper single-leg forward fold.',
      NO_EQUIPMENT,
      'Execution: The player sits on the floor, extends one leg straight forward and places the sole of the other foot against the inner thigh. The torso turns toward the extended leg and hinges forward from the hips; the hands slide along the leg toward the ankle or foot while the chest reaches toward the knee.',
      'Key Points: It is important that the back does not round and that the movement starts at the hip joint. Keep the shoulders relaxed; the stretch should be felt along the entire back line of the leg (hip, behind the knee, calf). Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Forward Fold', 'Single-Leg Stretch', 'Hamstring', 'Calf', 'Static Stretch', 'Cool-down', 'Solo', 'No Equipment'],
  },
  147: {
    name: 'Downward Dog',
    desc: [
      'Drill Objective: Stretch the shoulders, back, hamstrings and calves at the same time; lengthen the spine to provide general trunk-and-leg mobility in both the preparation and recovery phase.',
      NO_EQUIPMENT,
      'Execution: With the hands and feet on the floor the player forms an inverted V. Hands are shoulder-width apart, feet hip-width apart. The hips are pushed up and back while the arms and back lengthen into a straight line. Try to bring the heels toward the floor; the knees may stay slightly bent if needed.',
      'Key Points: The head hangs comfortably between the arms and the shoulders stay away from the ears. The stretch is felt in the shoulders, upper back, hamstrings and calves. Hold briefly as a warm-up, longer and deeper as a cool-down.',
    ].join('\n\n'),
    tags: ['Downward Dog', 'Shoulder Stretch', 'Hamstring', 'Calf', 'Full Body', 'Warm-up', 'Cool-down', 'Solo'],
  },
  148: {
    name: 'Spiderman Stretch',
    desc: [
      'Drill Objective: Increase flexibility of the hip flexors, groin and inner thigh; develop hip range of motion through a deep lunge position.',
      NO_EQUIPMENT,
      'Execution: The player steps one foot far forward into a deep lunge. The front knee is above the ankle and the back leg extends behind, straight or slightly bent. The hands are placed on the floor inside the front foot; the body weight shifts forward and down to bring the hips toward the floor. Optionally, the front elbow can also be lowered to the floor.',
      'Key Points: The stretch should be felt in the groin/inner thigh of the front leg and in the hip flexor of the back leg. Keep the back flat and deepen the stretch by pushing the hips slightly forward. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Spiderman Stretch', 'Lunge', 'Hip Flexor', 'Groin Stretch', 'Static Stretch', 'Cool-down', 'Solo', 'No Equipment'],
  },
  149: {
    name: 'Side-Lying Quadriceps Stretch',
    desc: [
      'Drill Objective: Increase flexibility of the quadriceps; release tension at the front of the leg after jumping and spiking.',
      NO_EQUIPMENT,
      'Execution: The player starts lying on one side, with the bottom leg slightly bent for support. The ankle of the top leg is grasped with the hand. The heel is drawn gently toward the glutes and the hip pushes forward to deepen the stretch at the front of the thigh. The knee stays in its natural alignment without being forced.',
      'Key Points: Keep the torso and shoulders balanced and avoid over-arching the lower back. The stretch should be felt on the front of the thigh, and there should be no sudden pulling. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Quadriceps Stretch', 'Front of Thigh', 'Side-Lying Stretch', 'Flexibility', 'Static Stretch', 'Cool-down', 'Solo', 'No Equipment'],
  },
  150: {
    name: '90/90 Hip Stretch',
    desc: [
      'Drill Objective: Increase flexibility of the internal and external hip rotators; develop hip range of motion to support preparation for and recovery from rotational movements.',
      NO_EQUIPMENT,
      'Execution: The player sits on the floor and places the front leg bent at 90 degrees at both hip and knee. The back leg is also positioned at 90 degrees, out to the side and behind. Keeping the back upright, the torso leans over the front leg; the stretch is felt on the outside of the front hip and on the inner/front hip of the back leg.',
      'Key Points: Keep the hips as level and balanced as possible and do not strain the lower back. Bring the torso forward gradually with the breath. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['90/90 Stretch', 'Hip Rotation', 'Hip Mobility', 'Flexibility', 'Static Stretch', 'Cool-down', 'Solo', 'No Equipment'],
  },
  152: {
    name: 'Cross-Body Shoulder Stretch',
    desc: [
      'Drill Objective: Increase flexibility in the rear shoulder (posterior deltoid) and upper back; support shoulder comfort before and after spiking and blocking.',
      NO_EQUIPMENT,
      'Execution: Standing or seated, the player extends one arm across the chest toward the opposite side. The other arm holds it at the elbow or upper arm and gently presses it toward the chest. Keep the shoulders down and relaxed and the torso still. The stretch is felt behind the shoulder of the extended arm.',
      'Key Points: Apply pressure gradually and under control — never yank or pull sharply. Use short, dynamic holds as a warm-up and longer static holds as a cool-down. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Shoulder Stretch', 'Cross-Body Arm', 'Posterior Deltoid', 'Upper Back', 'Stretching', 'Warm-up', 'Cool-down', 'Solo'],
  },
  154: {
    name: 'Overhead Triceps Stretch',
    desc: [
      'Drill Objective: Release tension in the back of the arm (triceps) and the top of the shoulder; support arm range of motion before and after spiking and serving.',
      NO_EQUIPMENT,
      'Execution: The player raises one arm, bends the elbow and lowers the hand toward the upper back behind the neck. The other hand gently holds the bent elbow and presses it slightly back and down; the stretch is felt in the triceps and the top of the shoulder.',
      'Key Points: Keep the torso upright, avoid arching the lower back and apply pressure under control. Use short dynamic holds before training and longer static holds in the cool-down. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Triceps Stretch', 'Back of Arm', 'Shoulder Stretch', 'Overhead Stretch', 'Warm-up', 'Cool-down', 'Solo', 'No Equipment'],
  },
  156: {
    name: 'Half-Kneeling Hip Flexor Stretch',
    desc: [
      'Drill Objective: Increase hip flexor flexibility; support hip range of motion in movements such as the attack approach and the jump.',
      NO_EQUIPMENT,
      'Execution: The player takes a half-kneeling position with one knee on the floor and the other foot in front, knee bent to 90 degrees. The hips are pushed gently forward with the torso upright. The stretch is felt at the front of the hip on the kneeling side. Optionally, reaching the back arm overhead deepens the stretch.',
      'Key Points: Do not over-arch the lower back, and keep the torso balanced as the hips move forward. Use short controlled holds as a warm-up and longer, deeper static holds as a cool-down. Switch sides when the time is up.',
    ].join('\n\n'),
    tags: ['Hip Flexor Stretch', 'Half-Kneeling', 'Hip Mobility', 'Warm-up', 'Cool-down', 'Solo', 'No Equipment'],
  },
  160: {
    name: 'Back Rolls',
    desc: [
      'Drill Objective: Release tension around the spine; provide gentle relaxation and mobilization of the back and lower back after training.',
      NO_EQUIPMENT,
      'Execution: The player lies on their back, draws the knees toward the chest with the hands and tucks the body into a slightly rounded shape. Holding that position, the player rolls slowly and under control back and forth along the spine, so the lower, middle and upper back contact the floor in turn.',
      'Key Points: Keep the neck relaxed throughout and avoid sudden or hard bouncing. The aim is to gently release the muscles around the spine and provide post-training relaxation.',
    ].join('\n\n'),
    tags: ['Back Rolls', 'Spinal Mobility', 'Relaxation', 'Back Stretch', 'Cool-down', 'Solo', 'No Equipment'],
  },
  164: {
    name: 'Seated Side-to-Side Glute Stretch',
    desc: [
      'Drill Objective: Release tension in the external hip rotators and the glutes; create a stretch at different hip angles by moving the torso from side to side.',
      NO_EQUIPMENT,
      'Execution: The player sits on the floor, bends one leg and draws the knee toward the chest, holding it with both hands; the other leg rests comfortably forward on the floor. The free hand can be used on the floor for balance. From this position the torso moves side to side under control, bringing the held knee toward the chest; the stretch is felt from a different angle in each direction.',
      'Key Points: Try to keep the back upright during the movement, and let the pull come from the controlled movement of the torso rather than from the arms. The stretch should be felt in the glutes and the outer hip. Switch sides when the set time is up.',
    ].join('\n\n'),
    tags: ['Hip Stretch', 'Glute Stretch', 'Seated Stretch', 'Side-to-Side Movement', 'Static Stretch', 'Cool-down', 'Solo', 'No Equipment'],
  },

  // ── Main session ───────────────────────────────────────────────────────────
  106: {
    name: 'Kneeling Left-Right Reaction and One-Touch Control',
    desc: [
      "Drill Objective: Develop reaction speed, hand-eye coordination and the ability to play balls that change direction suddenly with the right technique; improve balance and ball control in the defensive position.",
      BALL,
      'Execution: Two players face each other about 2-3 metres apart. One player stands holding two balls. The other kneels with the torso leaning slightly forward, arms open to the sides and palms facing up in the ready position. Without telegraphing the direction, the standing player throws one of the balls to the right or the left. The kneeling player reads the direction quickly, reaches a hand under the ball and returns it to the partner in a single touch off the palm without holding it. The drill continues alternating right and left.',
      'Key Points: The player keeps the torso balanced throughout and the head up, tracking the ball to the last moment. Reach the ball not just by extending the arm but by turning the shoulder and torso toward it; on contact the palm faces up and the ball is directed back under control.',
    ].join('\n\n'),
    tags: ['reaction', 'hand control', 'hand-eye coordination', 'defensive reflex', 'kneeling', 'one touch', '2 players', 'beginner'],
  },
  107: {
    name: 'Block Timing and Contact Technique at the Net',
    desc: [
      'Drill Objective: Develop the blocking jump, correct timing and the ability to contact the ball at the highest point above the net; build the habit of correct hand position and a controlled landing.',
      BALL_NET,
      'Execution: Two players stand on opposite sides of the net. One holds the ball still just above the height of the net. The other waits in front of the net in the blocking ready position. The blocker bends the knees under control, jumps and grabs the ball with both hands over the net. After taking the ball they land in balance and pass it back under the net to the partner. The movement is repeated the same way.',
      'Key Points: Before the jump the knees are slightly bent and the weight is on the balls of the feet. During the block the arms extend strongly upward, the hands penetrate over the net toward the opposing court, and contact is made at the highest reachable point. On landing, both feet should touch down together and the knees bend to absorb the impact.',
    ].join('\n\n'),
    tags: ['block', 'at the net', 'blocking technique', 'block jump', 'hand position', 'timing', '2 players', 'beginner'],
  },
  108: {
    name: 'Half-Kneeling Controlled Overhead Pass to Zone 4',
    desc: [
      'Drill Objective: Develop the overhead passing (setting) technique while holding balance on one knee, improve upper-body control and build the ability to deliver an accurate ball to zone 4.',
      BALL_NET,
      'Execution: One player kneels on one knee in front of the net between zones 2 and 3. The other player stands behind the 3-metre line. The back player starts the drill by sending the ball with an overhead pass to the player at the net. The player at the net controls the incoming ball above the head, holds it briefly in the setting position and then delivers a controlled overhead pass to zone 4. The ball is retrieved by the back player and the drill continues the same way.',
      'Key Points: Because the drill is done on one knee, the player must keep the torso upright, turn the shoulders toward the target and make contact above the head. The fingers stay naturally spread, the ball is never taken into the palms, and the power comes not only from the arms but from coordinated shoulder, torso and wrist action. The aim is to deliver a set of the same height and accuracy on every repetition without losing balance.',
    ].join('\n\n'),
    tags: ['overhead pass', 'zone 4', 'half-kneeling', 'setter', 'ball control', 'balance', '2 players', 'intermediate'],
  },
  109: {
    name: 'Stationary Blocking from Zone 2',
    desc: [
      'Drill Objective: Develop the correct blocking stance, jump timing and hand position in zone 2; enable the player to block the attack at the right moment while holding position.',
      'Equipment Needed: Volleyball, net, bench or similar raised platform.',
      'Execution: One player stands on a bench or similar platform in zone 4 to act as the attacker. The other waits in the blocking ready position in zone 2 on the opposite side of the net. The attacker spikes the ball into the opposing court under control. The blocker tracks the flight of the ball without moving from position and tries to block it with correct timing.',
      'Key Points: Before the block the feet are shoulder-width apart, the knees slightly bent and the weight on the balls of the feet. The hands are ready at shoulder height, palms facing the net, elbows slightly bent. At the moment the attacker contacts the ball, the blocker jumps powerfully off both feet, extends the arms fully upward and penetrates the hands over the net toward the opposing court. The fingers stay spread and firm, aiming to direct the ball back into the opponent’s court. On landing, both feet should touch down together and the knees absorb the impact to keep balance.',
    ].join('\n\n'),
    tags: ['block', 'zone 2', 'stationary block', 'blocking technique', 'block timing', 'zone 4 attack', '2 players', 'beginner'],
  },
  110: {
    name: 'Half-Kneeling Direct (One-Touch) Overhead Pass to Zone 4',
    desc: [
      'Drill Objective: Develop the ability to deliver an overhead pass to zone 4 in a single touch without holding the ball, while keeping balance on one knee; improve reaction, hand position and setting timing.',
      BALL_NET,
      'Execution: One player kneels on one knee in front of the net between zones 2 and 3. The other player stands behind the 3-metre line. The back player starts the drill by sending the ball with an overhead pass to the player at the net. Without holding the ball above the head, the player at the net delivers it to zone 4 in a single overhead-pass touch. The ball is retrieved by the back player and the drill continues the same way.',
      'Key Points: In this drill the ball is never controlled or held. The player must get under the ball in time, bring the hands into the setting position in advance and make contact just above the head. Because the drill is done on one knee, balance must be maintained, the shoulders aimed at the target, and the pass produced by coordinated action of the fingers, wrists and upper body. The aim is to direct the ball smoothly and accurately to zone 4 on every repetition.',
    ].join('\n\n'),
    tags: ['overhead pass', 'direct set', 'zone 4', 'half-kneeling', 'setter', 'one touch', 'setting accuracy', 'intermediate'],
  },
  111: {
    name: 'Two-Direction Target Setting Drill',
    desc: [
      'Drill Objective: Develop setting accuracy and directional control; build the setter’s ability to deliver the ball to zones 2 and 4 at the right height and angle.',
      'Equipment Needed: Volleyball, net, cone (or a hoop as a target).',
      'Execution: One player takes the setter position in front of the net between zones 2 and 3. The other stands behind the 3-metre line and starts the drill with an overhead pass to the setter. The setter moves under the incoming ball and tries to set it onto the target (cone or hoop) placed in zone 2. After the set number of repetitions, the same work is repeated to the target in zone 4. This way the setter practises delivering controlled, accurate sets to both pins.',
      'Key Points: The player must get under the ball early, keep the elbows in a natural position and make contact just above the head. The power comes not only from the arms but from a controlled rise of the knees, torso balance and the direction given by the fingers. The aim is to deliver the same height, tempo and accuracy to both targets.',
    ].join('\n\n'),
    tags: ['overhead pass', 'setter', 'target setting', 'zone 2', 'zone 4', 'setting accuracy', 'ball control', 'intermediate'],
  },
  112: {
    name: 'Jump Set to Zone 4',
    desc: [
      'Drill Objective: Develop the jump-set technique, setter timing and the ability to deliver an accurate ball to zone 4 while on the move.',
      BALL_NET,
      'Execution: Two players face each other parallel to the net. One starts the drill by tossing the ball to the partner under control. The other moves toward the incoming ball, gets under it in time and jump-sets it to zone 4. After the set, the ball is retrieved by the player at the starting point and the drill continues the same way.',
      'Key Points: Before jumping, the player must set the feet in balance, prepare the hands early and contact the ball in the air above the head. The fingers stay spread in a natural position, the ball is never taken into the palms, and the set is directed by a controlled push of the fingers and wrists. After the jump the player lands balanced on both feet and returns quickly to the ready position for the next repetition.',
    ].join('\n\n'),
    tags: ['overhead pass', 'jump set', 'zone 4', 'setter', 'setting timing', 'ball control', 'advanced'],
  },
  113: {
    name: 'Partner Forearm Passing Fundamentals',
    desc: [
      'Drill Objective: Develop correct forearm-pass technique, ball control and passing accuracy; get the player to move into position behind the ball and deliver a controlled, balanced pass.',
      BALL,
      'Execution: Two players face each other parallel to the net. One starts the drill by tossing the ball to the partner under control. The other moves into position behind the incoming ball and passes it back with the forearm-pass technique. The drill continues back and forth at the same rhythm.',
      'Key Points: During the pass the feet are shoulder-width apart, the knees slightly bent and the weight on the balls of the feet. The player moves toward the ball with short steps to get the body behind it and joins the arms without bending the elbows to build a solid platform. On contact, the power comes not only from the arms but is supported by a controlled rise of the knees, and the ball is directed accurately to the partner.',
    ].join('\n\n'),
    tags: ['forearm pass', 'fundamentals', 'ball control', 'passing control', 'bump', 'defense', '2 players', 'beginner'],
  },
  114: {
    name: 'Sharp Cross-Court Spike and Controlled Forearm Pass',
    desc: [
      'Drill Objective: Develop sharp cross-court attacking accuracy, forearm-pass control and the ability to produce a controlled ball out of defense; work on attacking and defensive technique at the correct angle.',
      BALL_NET,
      'Execution: Two players stand on opposite sides of the net in a sharp cross-court alignment — one in zone 4 (left front) and the other in zone 5 (left back) of the opposing court, or its mirror image, so the ball travels on a short cross-court angle. Without moving from their spot and without jumping, one player uses the spiking arm action to send the ball to the partner on the sharp cross. The receiving player controls it with a forearm pass, lifts it above the head to gain control and then sends it back to the partner on the same sharp cross with the same technique. The drill continues back and forth at the same tempo.',
      'Key Points: The attacking player uses an open hand and a controlled spiking motion, prioritising accuracy over power. The passing player reads the incoming angle correctly, places the body behind the ball, builds a solid platform without bending the elbows and lifts the ball under control to head height.',
    ].join('\n\n'),
    tags: ['sharp cross-court', 'spike', 'forearm pass', 'ball control', 'attack', 'defense', 'cross-court drill', 'intermediate'],
  },
  115: {
    name: 'Lateral-Movement Overhead Passing Across the Net',
    desc: [
      'Drill Objective: Develop overhead passing, footwork coordination and ball control while on the move; get players to keep their balance and deliver accurate passes during lateral movement.',
      BALL_NET,
      'Execution: Two players stand on opposite sides of the net in front of the 3-metre line, facing each other. One starts the drill with an overhead pass. As the receiving player passes the ball back overhead, both players shuffle sideways in the same direction, parallel to the net. The rally continues without a break while the players move laterally along the court to the end of the line. On reaching the end, the direction reverses and the same work is repeated back to the starting point.',
      'Key Points: During lateral movement the feet must not cross, the torso stays balanced, and players get under the ball before each pass. Overhead contact is made above the head, the ball is never taken into the palms, and the passes are delivered at the same height and tempo. Throughout the drill the priority is not speed but keeping the pass quality while moving.',
    ].join('\n\n'),
    tags: ['overhead pass', 'lateral movement', 'footwork', 'parallel to net', 'ball control', 'setter', '2 players', 'intermediate'],
  },
  116: {
    name: 'Kneeling Pancake Reaction Drill',
    desc: [
      'Drill Objective: Develop the pancake defensive technique and reaction speed; build the ability to play balls that are about to hit the floor with the right technique at the last moment.',
      BALL,
      'Execution: Two players face each other about 2 metres apart. One waits on one or both knees, ready for a pancake. The other stands holding a ball in each hand. Without telegraphing which one, the standing player suddenly drops one of the balls toward the floor. Before the ball lands, the kneeling player reacts quickly and executes the pancake: the hand is laid flat, palm down, under the ball, creating a surface between the ball and the floor so the ball does not land. The drill is repeated alternating right and left.',
      'Key Points: During the pancake the player should not try to hit the ball; the focus is on getting the hand to the landing spot in time. The arm extends fully, the hand stays as close to the floor as possible, and the head tracks the ball to the last moment. The aim is to keep the ball in play with a fast, technically correct reaction.',
    ].join('\n\n'),
    tags: ['pancake', 'reaction', 'floor defense', 'reflex', 'ball save', 'defense', 'kneeling', 'intermediate'],
  },
  117: {
    name: 'Partner Standing (No-Jump) Spiking',
    desc: [
      'Drill Objective: Develop standing spiking technique, correct arm mechanics and ball control; get players to make a controlled attacking contact, deliver an accurate ball and build the right swing habit.',
      BALL_NET,
      'Execution: Two players stand on opposite sides of the net behind the 3-metre line, facing each other. One tosses the ball in front of themselves under control and starts the drill by sending it over the net with a standing spike motion. The partner catches the ball under control with the hands, then applies the same technique to send it back. The drill continues back and forth at the same tempo.',
      'Key Points: On contact the player meets the ball in front of the shoulder, swings the hitting arm from back to front in a smooth motion and contacts the ball with an open hand. The body weight transfers from the back foot to the front foot and the wrist directs the ball. The aim here is not to hit hard but to learn correct spiking mechanics, increase accuracy and build technical repetition.',
    ].join('\n\n'),
    tags: ['spike', 'standing spike', 'attack fundamentals', 'arm mechanics', 'ball control', 'attacking technique', '2 players', 'beginner'],
  },
  118: {
    name: 'Forearm Pass Control and Second-Contact Preparation',
    desc: [
      'Drill Objective: Develop forearm-pass control, preparation for the second contact and the ability to keep the ball in play under control; build the skill of lifting the ball to the ideal height after the pass.',
      BALL_NET,
      'Execution: Two players stand on opposite sides of the net behind the 3-metre line, facing each other. One starts the drill by sending the ball over the net to the partner under control. The receiving player passes the incoming ball above head height, at a height suitable for a second contact. They then catch the ball under control with the hands and send it back over the net to the partner. The drill continues back and forth the same way.',
      'Key Points: The player must move into position behind the ball, bend the knees slightly and build a solid platform without breaking the elbows. The ball is lifted above head height — neither too low nor too high — and controlled at a distance suitable for a second contact. This drill focuses in particular on ball control after the pass and preparation for the second contact.',
    ].join('\n\n'),
    tags: ['forearm pass', 'ball control', 'bump', 'second contact', 'defense', '2 players', 'fundamentals', 'beginner'],
  },
  119: {
    name: 'Controlled Overhead Passing Above the Head',
    desc: [
      'Drill Objective: Develop overhead-pass control, hand coordination and the ability to prepare the ball for the second contact; get the player to direct the ball under control above the head and deliver an accurate pass.',
      BALL,
      'Execution: Two players face each other parallel to the net. One starts the drill by sending the ball to the partner with an overhead pass. The other controls the incoming ball above the head with the overhead-pass technique. After holding it under control briefly, the second touch sends it back to the partner, again with an overhead pass. The drill continues back and forth at the same tempo.',
      'Key Points: During the control the player prepares the hands above forehead height, keeps the fingers naturally spread and contacts the ball only with the fingertips. The ball is never taken into the palms, body balance is maintained, and the second pass is executed in one smooth motion. The aim is to prepare the ball at the same height and control on every repetition and deliver it accurately to the partner.',
    ].join('\n\n'),
    tags: ['overhead pass', 'ball control', 'setter', 'second contact', 'setting technique', '2 players', 'fundamentals', 'beginner'],
  },
  120: {
    name: 'Serve Receive – Target-Directed Forearm Passing',
    desc: [
      'Drill Objective: Develop serve-receive technique, passing accuracy and the ability to direct the ball to the setter’s zone under control; build the skill of taking the right position after the serve and producing a quality first ball.',
      'Equipment Needed: Volleyball, net, hoop (target).',
      'Execution: Two players stand on opposite sides of the net behind the 3-metre line. A hoop is placed in front of the net between zones 2 and 3 as a target. One player starts the drill by sending the ball over as if serving, under control. The receiving player, in the serve-receive ready position, moves toward the incoming ball and tries to pass it into the hoop between zones 2 and 3. Roles are swapped after each repetition and the drill continues back and forth.',
      'Key Points: In the reception the player bends the knees slightly, keeps the weight on the balls of the feet and moves behind the ball with short steps. The arms form a solid platform without bending at the elbows, the power on contact comes from the legs, and the ball is directed to the target at a controlled angle. The aim is not merely to keep the ball in play but to deliver an accurate first ball into the zone where the setter can work comfortably.',
    ].join('\n\n'),
    tags: ['serve receive', 'forearm pass', 'target passing', 'first ball', 'setter zone', 'ball control', '2 players', 'intermediate'],
  },
  121: {
    name: 'Basic Jump Serve',
    desc: [
      'Drill Objective: Develop the jump-serve technique, the timing between the toss and the jump and correct contact in the air; enable the player to serve under control and with accuracy.',
      BALL_NET,
      'Execution: Two players stand on opposite sides of the net behind the 3-metre line. One tosses the ball in front of themselves at a height suitable for the serve, completes the approach steps, jumps and contacts the ball in the air, sending it over the net into the opposing court. The partner controls the ball, applies the same technique and serves it back. The drill continues in the same pattern.',
      'Key Points: The toss should go neither too far forward nor too far back; it must land where the player can reach it comfortably from the jump. The approach steps should be rhythmic, the take-off strong off both feet, and contact made at the highest reachable point. Use an open hand on contact, direct the ball with the wrist and land under control after the serve. The priority in this drill is not serve power but a correct toss, approach rhythm, jump timing and a technically clean contact.',
    ].join('\n\n'),
    tags: ['jump serve', 'serve', 'serving technique', 'toss', 'timing', '2 players', 'intermediate'],
  },
  122: {
    name: 'Mixed-Technique Partner Ball Control',
    desc: [
      'Drill Objective: Develop the ability to switch quickly between overhead passing, roll shots and spiking; get players to choose the right technique at the right moment to improve ball control and rally continuity.',
      BALL_NET,
      'Execution: Two players face each other parallel to the net. One starts the drill with an overhead pass to the partner. The players then continue to send the ball back and forth using overhead passes, roll shots and spikes in turn. Each player chooses the appropriate technique based on the height and speed of the incoming ball and tries to keep the rally going.',
      'Key Points: Throughout the drill players must move into position under the ball, keep their balance before each contact and use the body position that fits the technique. In overhead passes the ball is met above the head; in roll shots the wrist directs the ball into open space; in spikes the arm mechanics stay controlled and accuracy comes first. The aim is not to hit hard but to move smoothly between techniques and keep the rally alive.',
    ].join('\n\n'),
    tags: ['overhead pass', 'roll shot', 'spike', 'ball control', 'mixed technique', 'rally', '2 players', 'advanced'],
  },
  123: {
    name: 'Overhead Pass Control and Second Contact',
    desc: [
      'Drill Objective: Develop overhead-passing technique, ball control and preparation for the second contact; get the player to receive the ball above the head under control and deliver a balanced, accurate pass.',
      BALL_NET,
      'Execution: Two players stand on opposite sides of the net behind the 3-metre line, facing each other. One starts the drill with an overhead pass to the partner. The receiving player controls the incoming ball above the head with the overhead-pass technique, holds it briefly under control and then catches it with the hands. They then send it back to the partner with an overhead pass. The drill continues back and forth in the same pattern and rhythm.',
      'Key Points: During the control the player gets under the ball early, prepares the hands above forehead height and contacts the ball only with the fingertips. The ball is never taken into the palms, body balance is maintained, and the second pass is executed in one smooth motion. The aim is to prepare the ball at the same height and control on every repetition and deliver it accurately to the partner.',
    ].join('\n\n'),
    tags: ['overhead pass', 'ball control', 'setter', 'controlled pass', 'second contact', 'setting accuracy', '2 players', 'beginner'],
  },
  124: {
    name: 'Target-Directed Attack from Zone 4',
    desc: [
      'Drill Objective: Develop attack timing from zone 4, the transition from defense to attack and directional control of the attack; build fast attack preparation after a dig and accurate spiking to designated targets.',
      'Equipment Needed: Volleyball, net, cones.',
      'Execution: One player takes zone 4 and the other the setter position between zones 2 and 3. Cones are placed as targets in zones 1 and 5 of the opposing court. The player in zone 4 starts the drill by sending the ball to the setter. On the first contact the setter sends a controlled ball back so the player can dig it. The player passes it back to the setter with correct forearm-pass technique. Immediately after the dig, the player completes the attack preparation. The setter delivers the ball to zone 4 at the right tempo and height. The attacker uses correct approach steps, executes the spike and tries to hit the target cones in zone 1 or 5.',
      'Key Points: Throughout the drill the player must start the attack approach without delay after the dig, adjust the last steps to the tempo of the set and contact the ball at the highest reachable point. In the attack the priority is not power alone but target selection, accuracy and directional control.',
    ].join('\n\n'),
    tags: ['zone 4', 'spike', 'forearm pass', 'defense-to-attack transition', 'target attack', 'setter', 'ball control', 'advanced'],
  },
  125: {
    name: 'Back Set to Zone 2 from a Turned-Away Position',
    desc: [
      'Drill Objective: Develop the back-set technique and directional feel; build the setter’s ability to deliver an accurate ball to zone 2 with the back turned to the target.',
      'Equipment Needed: Volleyball, net, cone (or a hoop as a target).',
      'Execution: One player takes the setter position in front of the net between zones 2 and 3. The other stands behind the 3-metre line and starts the drill with an overhead pass to the setter. The setter positions with the back toward zone 2. Getting under the incoming ball, they use the back-set technique to direct it onto the target (cone or hoop) in zone 2.',
      'Key Points: On contact the head and shoulders stay balanced, the hands are prepared above the head and the set is executed backward in one smooth motion. The player must not use the arms alone; the ball is directed to the target with support from the knees, torso balance and wrist control. The aim is to control the height and direction of the back set and hit the target on every repetition.',
    ].join('\n\n'),
    tags: ['back set', 'setter', 'blind set', 'zone 2', 'target setting', 'setting accuracy', 'ball control', 'advanced'],
  },
  126: {
    name: 'Back Set to Zone 4 from a Turned-Away Position',
    desc: [
      'Drill Objective: Develop the back-set technique and directional control; build the setter’s ability to deliver an accurate ball to zone 4 with the back turned to the target.',
      'Equipment Needed: Volleyball, net, cone (or a hoop as a target).',
      'Execution: One player takes the setter position in front of the net between zones 2 and 3. The other stands behind the 3-metre line and starts the drill with an overhead pass to the setter. The setter positions with the back toward zone 4. Getting under the incoming ball, they use the back-set technique to direct it onto the target (cone or hoop) in zone 4.',
      'Key Points: On contact the hands must be ready above the head, the elbows in a natural position and the contact made in one smooth motion. The player must not direct the ball with the arms alone; support from the knees, torso balance and wrist action send the ball to the target under control. The height and direction of the set should be the same quality on every repetition, with accuracy the priority.',
    ].join('\n\n'),
    tags: ['back set', 'setter', 'blind set', 'zone 4', 'target setting', 'setting accuracy', 'ball control', 'advanced'],
  },
  127: {
    name: 'Setter Dump and Roll-Shot Decision Drill',
    desc: [
      'Drill Objective: Develop the dump and roll-shot attacks played from the setter position; build the ability to read the space left open by the opposing block and defense and place the ball into the scoring zone under control.',
      'Equipment Needed: Volleyball, net, cone or target hoop (optional).',
      'Execution: One player takes the setter position in front of the net between zones 2 and 3. The other stands behind the 3-metre line and starts the drill with an overhead pass to the setter. The setter gets under the incoming ball but, instead of setting, makes an attacking decision on the second contact: either dumping the ball softly over the net into zone 2 of the opposing court, or directing it into zone 1 with a controlled spiking motion. In both cases the aim is accuracy and correct zone selection rather than power. This drill particularly suits left-handed setters, whose natural attacking angles it develops. Right-handed players can mirror the drill, dumping into zone 4 or directing a controlled roll shot/spike into zone 5.',
      'Key Points: Before attacking, the player should look like they are about to set until the last moment, contact the ball at the highest point and place it into the open space with wrist control.',
    ].join('\n\n'),
    tags: ['tip', 'dump', 'setter attack', 'roll shot', 'second-ball attack', 'setter', 'attacking decision', 'advanced'],
  },
  128: {
    name: 'Wall Target Serve and Forearm Pass Reception',
    desc: [
      'Drill Objective: Develop serving accuracy, forearm-pass control and serve-receive skill; practise both serving to a target and passing the rebound off the wall back to a designated spot under control.',
      'Equipment Needed: Volleyball, wall, target marker (tape, cone, target sticker etc.).',
      'Execution: One player waits about 1-2 metres from the wall on one knee, ready in the passing position. The other stands behind the partner, at a distance from which they can serve at the wall. The server sends the ball to a pre-marked target spot on the wall under control. The ball rebounds off the wall to the player in front. The kneeling player uses correct forearm-pass technique to direct the ball back to the same target area on the wall. The drill continues rhythmically in this way.',
      'Key Points: The passing player stays balanced on the knees, leans the torso slightly forward and forms a solid platform without bending at the elbows. They adjust the shoulder angle to the incoming direction of the ball and direct it to the target under control. The server focuses on aiming at the same spot every repetition to develop serving accuracy.',
    ].join('\n\n'),
    tags: ['serve', 'forearm pass', 'serve receive', 'wall drill', 'target serving', 'target passing', 'kneeling', 'beginner'],
  },
  129: {
    name: 'Basic Overhead Pass to Zone 4',
    desc: [
      'Drill Objective: Develop overhead-passing technique, setting accuracy and the ability to deliver a controlled ball to zone 4; get the player to take the right position and deliver a balanced, accurate set.',
      BALL_NET,
      'Execution: Two players face each other parallel to the net. One starts the drill by tossing the ball to the partner under control. The other moves into position under the ball and, without jumping, uses the overhead-pass technique above the head to send it to zone 4. The ball is retrieved by the player at the starting point and the drill continues the same way.',
      'Key Points: During the set the player bends the knees slightly, prepares the hands in the setting position before the ball arrives and makes contact just above the head. The fingers stay spread in a natural position, the ball is never taken into the palms, and the set is directed by a controlled rise of the legs together with coordinated hand and wrist action. The height, tempo and accuracy of the set should be maintained on every repetition.',
    ].join('\n\n'),
    tags: ['overhead pass', 'zone 4', 'setter', 'basic setting', 'setting accuracy', 'ball control', '2 players', 'beginner'],
  },
  130: {
    name: 'Spike – Pass – Controlled Attack Continuity Drill',
    desc: [
      'Drill Objective: Develop controlled attacking, forearm-pass defense and ball control in a single drill; extend the rally as long as possible to improve the transitions between attack and defense.',
      BALL_NET,
      'Execution: Two players stand on opposite sides of the net behind the 3-metre line, facing each other. One tosses the ball up in front of themselves under control and starts the drill by sending it into the opposing court with a standing spike. The partner meets the incoming ball with correct forearm-pass technique and lifts it above the head, under control, at a height and distance suitable for a second contact. Then, before the ball lands, they send it back over with a controlled attacking contact. The drill continues back and forth in this way, and the aim is to keep the rally going as long as possible without letting the ball drop.',
      'Key Points: Attacking players apply controlled power and prioritise accuracy and rally continuity. The passing player moves into position behind the ball, forms a solid platform and controls the ball at a height suitable for the second contact. Every repetition should be smooth and rhythmic, simulating the in-match transition from defense to a controlled attack.',
    ].join('\n\n'),
    tags: ['spike', 'forearm pass', 'ball control', 'rally', 'defense-to-attack transition', 'controlled attack', '2 players', 'intermediate'],
  },
  131: {
    name: 'Target-Directed Attack from Zone 2',
    desc: [
      'Drill Objective: Develop attack timing from zone 2, the transition from defense to attack and directional control of the attack; build fast attack preparation after a dig and accurate spiking to designated targets.',
      'Equipment Needed: Volleyball, net, cones.',
      'Execution: One player takes zone 2 and the other the setter position between zones 2 and 3. Cones are placed as targets in zones 1 and 5 of the opposing court. The player in zone 2 starts the drill by sending the ball to the setter. On the first contact the setter sends a controlled ball back so the player can dig it. The player passes it back to the setter with correct forearm-pass technique. Immediately after the dig, the player begins the attack approach without losing time. The setter delivers the ball to zone 2 at the right tempo and height. The attacker approaches the ball, executes the spike and tries to hit the target cones in zone 1 or 5.',
      'Key Points: Throughout the drill the player must move into the attacking position quickly after defending, adjust the approach steps to the tempo of the set and contact the ball at the highest reachable point. In attacking, the priority is not power alone but target selection, accuracy and directional control.',
    ].join('\n\n'),
    tags: ['zone 2', 'spike', 'defense-to-attack transition', 'forearm pass', 'target attack', 'setter', 'ball control', 'advanced'],
  },
  132: {
    name: 'Middle Attack Preparation and Timing Drill',
    desc: [
      'Drill Objective: Develop the middle blocker’s ball control before attacking, the attack approach and the timing of the middle attack; build fast attack preparation and effective hitting after the first contact.',
      BALL_NET,
      'Execution: One player stands behind the 3-metre line in the middle of the court. The other takes the setter position between zones 2 and 3. The setter starts the drill by sending the ball to the player behind the 3-metre line. The attacker plays the first ball under control, hitting it down under the net into the other side. Immediately after this first action they return quickly to the starting position and prepare to attack. The setter delivers the second ball at the tempo and height suited to a middle attack. Using correct approach steps, the attacker rises to the ball and spikes it from the middle over the net into the opposing court.',
      'Key Points: Throughout the drill the player must move into the attacking position as fast as possible after the first action, match the approach rhythm to the tempo of the set and contact the ball at the highest reachable point. The first part develops ball control and coordination, while the second focuses on the defense-to-attack transition and middle attack timing at match tempo.',
    ].join('\n\n'),
    tags: ['middle attack', 'zone 3', 'spike', 'attack approach', 'setter', 'defense-to-attack transition', 'ball control', 'advanced'],
  },
  133: {
    name: 'Turn-and-React Consecutive Spike Defense',
    desc: [
      'Drill Objective: Develop reaction speed and first-ball defense from a position with the back turned; then build correct forearm-pass technique against the attack that follows, shortening positioning and preparation time between one dig and the next.',
      BALL_NET,
      'Execution: Both players stand with their backs to the net. One is closer to the net and the other about 2-3 metres behind. Without warning, the player near the net drops the ball in front of the player behind. After it bounces once, the back player moves quickly to the ball and passes it back to the partner under control. Once the first ball is done, the tossing player sends a second ball, this time with a controlled spike. The defending player quickly takes the passing position and meets the attacked ball with correct forearm-pass technique to send it back to the partner.',
      'Key Points: Throughout the drill the player must return to the defensive position without losing time after reacting to the first ball. During the pass the knees stay bent, the weight rests on the balls of the feet and the arms form a solid platform without bending at the elbows. The aim is to be balanced and ready for the second dig right after a defense that began as a sudden reaction.',
    ].join('\n\n'),
    tags: ['reaction', 'forearm pass', 'spike defense', 'defense', 'reflex', 'positioning', 'ball control', 'intermediate'],
  },
  134: {
    name: 'Dig-to-Attack Transition – Zone 4 Attack',
    desc: [
      'Drill Objective: Develop the ability to move quickly into the attacking position after a dig, the timing with the setter and effective attacking from zone 4.',
      BALL_NET,
      'Execution: One player stands behind zone 4 and the other in the same zone on the opposing side. The first player starts the drill by sending the ball to the partner across the net. The receiving player controls it with a forearm pass and sends it back to the partner. Immediately after that pass they move to the other side of the net and take the setter position between zones 2 and 3. The first player, having controlled the passed ball, sends it to the partner who has now become the setter. The setter lifts the ball to zone 4 as an attacking set. The attacker uses correct approach steps, rises to the ball and executes the spike from zone 4.',
      'Key Points: Throughout the drill it is important that the players switch roles quickly and smoothly. The player who becomes the setter after the pass must deliver the ball at a height and spot suited to the tempo of the attack. The attacker must adjust the approach to the tempo of the set, complete the last two steps rhythmically and contact the ball at the highest reachable point.',
    ].join('\n\n'),
    tags: ['zone 4', 'spike', 'forearm pass', 'setter', 'defense-to-attack transition', 'attack timing', 'ball control', 'advanced'],
  },
  135: {
    name: 'Ball-in-Hand Overhead Pass Coordination Drill',
    desc: [
      'Drill Objective: Develop overhead-passing technique, hand-eye coordination, reaction speed and ball control; improve coordination by having players manage two different balls at once.',
      BALL_NET,
      'Execution: Two players stand on opposite sides of the net behind the 3-metre line. Each holds a volleyball; a third ball is the one in play. One player starts the drill by sending the third ball over the net with an overhead pass. Without releasing their own ball, the partner uses the ball held in their hands to contact the incoming ball and tries to send it back over the net. The same action continues back and forth.',
      'Key Points: Throughout the drill players must not drop the ball in their hands and must use only it to direct the third ball. On contact the hands stay above the head in the setting position, the touch is controlled and the ball is sent comfortably over the net. Players must keep tracking the direction of the ball, take the correct position and keep the movement flowing. The purpose of this drill is not to generate power but to develop coordination, reaction speed and hand control in the setting position.',
    ].join('\n\n'),
    tags: ['overhead pass', 'coordination', 'hand-eye coordination', 'ball control', 'reaction', 'setter', '3 balls', 'advanced'],
  },
  136: {
    name: 'Moving Overhead Pass and Position Switch Drill',
    desc: [
      'Drill Objective: Develop overhead passing on the move, position changes on court and the habit of moving correctly after the pass; get players to move quickly and under control into their new positions after setting.',
      BALL_NET,
      'Execution: Two players face each other parallel to the net. One starts the drill with an overhead pass to the partner. The receiving player passes the ball while moving parallel to the net toward the side of the court. Meanwhile, the player who sent the ball runs without the ball to take the position vacated on the other side. On completing the movement, the player turns to face the partner again and sends the ball with an overhead pass. The same pattern continues in the opposite direction, so that on every repetition players both pass and change position.',
      'Key Points: Throughout the drill it is important that players get under the ball while moving, make the overhead contact above the head and move quickly into their new positions after the pass. The aim is not just to pass correctly but to build the habit of moving after the pass so that in-game position changes become fluid.',
    ].join('\n\n'),
    tags: ['overhead pass', 'passing on the move', 'position switch', 'footwork', 'setter', 'ball control', '2 players', 'intermediate'],
  },
  137: {
    name: 'Progressive Back Set from a Bench',
    desc: [
      'Drill Objective: Develop the setter’s back-set technique across different difficulty levels; build correct timing and setting accuracy while keeping balance through the sit-to-stand transitions.',
      'Equipment Needed: Volleyball, net, bench.',
      'Execution: One player stands on the 3-metre line while the other sits on a bench in front of the net, between zones 2 and 3. The drill has three stages. Stage 1: the player behind the 3-metre line sends the ball to the seated player, who stands up as the ball approaches, controls it briefly above the head and delivers a back set to zone 2. Stage 2: the player sits back down on the bench. This time they play the incoming ball with a back set in a single touch, without standing up and without holding the ball. Stage 3: the player sits on the bench, stands up as the ball approaches but this time back-sets it to zone 2 in a single touch, without holding it above the head.',
      'Key Points: At every stage the player must get under the ball in time, prepare the hands in the setting position in advance and make contact above the head. In the stages that involve standing up, the movement must stay fluid, balance must not be lost and the direction and height of the set must be maintained. The purpose of the drill is to execute the back set with correct timing and high accuracy from different positions.',
    ].join('\n\n'),
    tags: ['back set', 'setter', 'bench drill', 'zone 2', 'ball control', 'setting accuracy', 'transition drill', 'advanced'],
  },
};

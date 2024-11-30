const fs = require('fs')
const { resume } = require("pdfkit");
const pool = require("../utils/dbConnection");

exports.getResult = catchAsyncError(async (req, res) => {
  const result = await pool.request()
    .query(`select mem.tx_group_name, mem.VoterSL,mem.memname, count( vote.is_vote)  from t_vote Vote inner join
(select a.id_candidate_key,  a.id_member_key, a.tx_org_sl BallotSL, b.tx_name MemName,tx_industry_name,b.tx_org_id VoterSL,b.tx_org_sl ,a.id_template_key,a.id_group_key,c.tx_group_name      from 
T_CANDIDATE a inner join 
T_MEMBER b on a.id_member_key =b.id_member_key inner join
T_GROUP c on a.id_group_key=c.id_group_key  
where a.id_template_key=100000) Mem
on vote.id_candidate_sys_key =mem.id_candidate_key 
inner join T_CENTER Cen on vote.id_center_key=Cen.id_center_key 
left join T_USER Us on Us.id_center_key=cen.id_center_key and vote.id_user_mod =Us.id_user_key  
where vote.is_vote=1 and vote.is_valid=1
group by mem.tx_group_name,mem.VoterSL,mem.memname order by  mem.tx_group_name desc, count( vote.is_vote) desc`);

  res.status(200).json({
    status: "Success",
    data: result.recordset.map((el) => {
      console.log(el)
      let memberImagePath;
      if (!fs.existsSync(__dirname + `/../public/images/${el.VoterSL}.jpg`)) {
        memberImagePath = `${req.protocol}://${req.hostname}/images/default_photo.png`;
      } else {
        memberImagePath = `${req.protocol}://${req.hostname}/images/${el.VoterSL}.jpg`;
      }
      return {
        tx_group_name: el.tx_group_name,
        candidateOrgKey: el.VoterSL,
        candidateName: el.memname,
        totalVote: el[""],
        candidateImage: memberImagePath,
      };
    }),
  });
});

exports.getTotalBallotNo = catchAsyncError(async (req, res) => {
  const result = await pool.request()
    .query(`select vote.id_bundle_no,vote.id_ballot_sn , vote.id_candidate_sys_key,vote.id_group_key,vote.is_valid, vote.is_vote, Cen.tx_name CenterName, mem.*  from t_vote Vote inner join
    (select a.id_candidate_key,  a.id_member_key, a.tx_org_sl BallotSL, b.tx_name MemName,tx_industry_name,b.tx_org_id VoterSL,b.tx_org_sl ,a.id_template_key,a.id_group_key,c.tx_group_name      from
    T_CANDIDATE a inner join
    T_MEMBER b on a.id_member_key =b.id_member_key inner join
    T_GROUP c on a.id_group_key=c.id_group_key
    where a.id_template_key=100000) Mem on vote.id_candidate_sys_key =mem.id_candidate_key
    inner join T_CENTER Cen on vote.id_center_key=Cen.id_center_key
    left join T_USER Us on Us.id_center_key=cen.id_center_key and vote.id_user_mod =Us.id_user_key
    order by vote.id_bundle_no ,vote.id_ballot_sn, mem.VoterSL
    `);
  res.status(200).json({
    status: "Success",
    data:
      result.recordset?.length % 15 === 0 ? result.recordset.length / 15 : 0,
  });
});
